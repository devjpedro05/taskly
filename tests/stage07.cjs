const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const crypto = require("node:crypto");
const { spawn } = require("node:child_process");
const Database = require("../backend/node_modules/better-sqlite3");

const root = path.resolve(__dirname, "..");
const directory = fs.mkdtempSync(path.join(os.tmpdir(), "taskly-stage07-"));
const databasePath = path.join(directory, "test.sqlite");
const base = "http://localhost:3001",
  origin = "http://localhost:5173";
const secret = crypto.randomBytes(48).toString("hex");
let server,
  browser,
  connection,
  checks = 0;
const cookies = {};
const accounts = {};
const evidence = path.join(root, "docs/evidencias/etapa-07");

async function start() {
  server = spawn(process.execPath, ["dist/server.js"], {
    cwd: path.join(root, "backend"),
    windowsHide: true,
    env: {
      ...process.env,
      DB_PATH: databasePath,
      JWT_SECRET: secret,
      FRONTEND_ORIGIN: origin,
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  await new Promise((resolve, reject) => {
    server.stdout.once("data", resolve);
    server.once("error", reject);
    server.once("exit", (code) => reject(Error("Servidor encerrou: " + code)));
    server.stderr.once("data", (data) => reject(Error(String(data))));
  });
}
async function stop() {
  if (!server || server.exitCode !== null || server.signalCode !== null) return;
  const exited = new Promise((resolve) => server.once("exit", resolve));
  server.kill();
  await exited;
}
async function http(user, method, url, status, data, headers = {}) {
  const response = await fetch(base + url, {
    method,
    headers: {
      Origin: origin,
      ...(data !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(cookies[user] ? { Cookie: cookies[user] } : {}),
      ...headers,
    },
    body: data !== undefined ? JSON.stringify(data) : undefined,
    signal: AbortSignal.timeout(12000),
  });
  const raw = await response.text();
  assert.equal(response.status, status, method + " " + url + " " + raw);
  if (response.headers.get("set-cookie"))
    cookies[user] = response.headers.get("set-cookie").split(";")[0];
  checks++;
  if (status === 204) {
    assert.equal(raw, "");
    return;
  }
  const result = JSON.parse(raw);
  if (status >= 400) {
    assert.deepEqual(Object.keys(result), ["error"]);
    assert.equal(typeof result.error, "string");
  }
  return result;
}
async function apiTests() {
  await start();
  await http("", "GET", "/activities", 401);
  await http(
    "",
    "POST",
    "/auth/register",
    403,
    {},
    { Origin: "https://evil.invalid" },
  );
  await http("", "POST", "/auth/register", 403, {}, { Origin: "" });
  await http("", "POST", "/auth/register", 400, {
    name: "",
    email: "bad",
    password: "short",
  });
  for (const label of ["a", "b"]) {
    const email = label + "@stage07.invalid",
      password = crypto.randomBytes(18).toString("hex");
    accounts[label] = { email, password };
    const user = await http(label, "POST", "/auth/register", 201, {
      name: "Estudante " + label.toUpperCase(),
      email,
      password,
    });
    assert.deepEqual(Object.keys(user), ["id", "name", "email"]);
    await http(label, "POST", "/auth/register", 409, {
      name: "Duplicado",
      email: email.toUpperCase(),
      password,
    });
    await http(label, "POST", "/auth/login", 401, {
      email,
      password: "errada123",
    });
    await http(label, "POST", "/auth/login", 200, {
      email: email.toUpperCase(),
      password,
    });
    assert.equal((await http(label, "GET", "/auth/me", 200)).id, user.id);
  }
  connection = new Database(databasePath);
  connection.pragma("foreign_keys = ON");
  assert.equal(connection.pragma("foreign_keys", { simple: true }), 1);
  assert.deepEqual(
    connection
      .prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name",
      )
      .all()
      .map((r) => r.name),
    ["activities", "categories", "subjects", "subtasks", "users"],
  );
  const hashes = connection.prepare("SELECT password_hash FROM users").all();
  assert.ok(
    hashes.every(
      (row) =>
        row.password_hash.startsWith("$2") &&
        row.password_hash !== accounts.a.password,
    ),
  );
  assert.equal(connection.prepare("PRAGMA foreign_key_check").all().length, 0);
  assert.throws(
    () =>
      connection
        .prepare("INSERT INTO subjects(user_id,name) VALUES(999999,'Inválida')")
        .run(),
    /FOREIGN KEY/,
  );

  const subject = await http("a", "POST", "/subjects", 201, {
    name: "Banco de Dados",
    professor: "Professora Ana",
  });
  const cats = await http("a", "GET", "/categories", 200);
  assert.equal(cats.length, 4);
  const category = cats[0];
  const payload = {
    title: "Projeto SQLite",
    description: "Criar e testar relações",
    subjectId: subject.id,
    categoryId: category.id,
    dueDate: "2026-12-10",
    priority: "HIGH",
    status: "PENDING",
  };
  const activity = await http("a", "POST", "/activities", 201, payload);
  const id = activity.id;
  assert.equal(activity.subject, "Banco de Dados");
  assert.equal(activity.category, "Trabalho");
  assert.equal(activity.dueDateLabel, "10/12/2026");
  await http("a", "GET", "/activities/abc", 400);
  await http("a", "POST", "/activities", 400, { ...payload, title: " " });
  await http("a", "POST", "/activities", 400, {
    ...payload,
    dueDate: "2026-02-30",
  });
  await http("a", "POST", "/activities", 400, { ...payload, user_id: 2 });
  await http("a", "POST", "/activities", 400, {
    ...payload,
    priority: "URGENT",
  });
  await http("a", "PATCH", "/activities/" + id, 400, { id: 2 });
  await http("a", "PATCH", "/activities/" + id, 400, {});
  assert.equal((await http("a", "GET", "/activities/" + id, 200)).id, id);
  assert.equal(
    (
      await http("a", "PATCH", "/activities/" + id, 200, {
        title: "Projeto persistente",
      })
    ).title,
    "Projeto persistente",
  );
  await http("a", "DELETE", "/subjects/" + subject.id, 409);
  await http("a", "DELETE", "/categories/" + category.id, 409);
  await http("a", "PATCH", "/subjects/" + subject.id, 200, {
    professor: "Professora atualizada",
  });
  await http("a", "PATCH", "/categories/" + category.id, 200, {
    name: "Trabalho acadêmico",
  });
  const sub = await http("a", "POST", "/activities/" + id + "/subtasks", 201, {
    title: "Criar modelo ER",
  });
  assert.equal(
    (
      await http(
        "a",
        "PATCH",
        "/activities/" + id + "/subtasks/" + sub.id,
        200,
        { completed: true, title: "Modelo ER pronto" },
      )
    ).completed,
    true,
  );
  await http("a", "PATCH", "/activities/" + id + "/subtasks/" + sub.id, 400, {
    completed: 1,
  });
  await http("a", "GET", "/activities/" + id + "/subtasks", 200);
  const bsubject = await http("b", "POST", "/subjects", 201, {
    name: "Algoritmos",
  });
  const bcategory = (await http("b", "GET", "/categories", 200))[0];
  assert.equal((await http("b", "GET", "/activities", 200)).length, 0);
  for (const [method, url, data] of [
    ["GET", "/activities/" + id],
    ["PATCH", "/activities/" + id, { title: "Intrusão" }],
    ["DELETE", "/activities/" + id],
    ["GET", "/activities/" + id + "/subtasks"],
    ["POST", "/activities/" + id + "/subtasks", { title: "Intrusão" }],
    ["PATCH", "/subjects/" + subject.id, { name: "Intrusão" }],
    ["DELETE", "/categories/" + category.id],
    ["POST", "/activities", { ...payload, categoryId: bcategory.id }],
    ["POST", "/activities", { ...payload, subjectId: bsubject.id }],
  ])
    await http("b", method, url, 404, data);
  assert.throws(
    () =>
      connection
        .prepare(
          "INSERT INTO activities(user_id,subject_id,category_id,title,description,due_date,priority,status) VALUES(2,?,?,?,'','2026-12-01','HIGH','PENDING')",
        )
        .run(subject.id, bcategory.id, "Vínculo cruzado"),
    /FOREIGN KEY/,
  );

  connection.exec("BEGIN EXCLUSIVE");
  try {
    await http("a", "POST", "/subjects", 500, { name: "Banco bloqueado" });
  } finally {
    connection.exec("ROLLBACK");
  }
  await stop();
  await start();
  const persisted = await http("a", "GET", "/activities/" + id, 200);
  assert.equal(persisted.title, "Projeto persistente");
  assert.equal(
    (await http("a", "GET", "/activities/" + id + "/subtasks", 200))[0]
      .completed,
    true,
  );
  assert.equal(
    (await http("a", "GET", "/subjects", 200))[0].professor,
    "Professora atualizada",
  );
  console.log(
    "Persistência: cadastro → consulta → reinício → consulta; atividade, disciplina, categoria, usuário e subtarefa preservados.",
  );

  await http("a", "DELETE", "/activities/" + id + "/subtasks/" + sub.id, 204);
  const cascade = await http(
    "a",
    "POST",
    "/activities/" + id + "/subtasks",
    201,
    { title: "Exclusão em cascata" },
  );
  await http("a", "DELETE", "/activities/" + id, 204);
  assert.equal(
    connection
      .prepare("SELECT count(*) AS n FROM subtasks WHERE id=?")
      .get(cascade.id).n,
    0,
  );
  await http("a", "GET", "/activities/" + id, 404);
  await http("a", "DELETE", "/subjects/" + subject.id, 204);
  await http("a", "DELETE", "/categories/" + category.id, 204);
  await http("a", "POST", "/auth/logout", 204);
  await http("a", "GET", "/auth/me", 401);
  console.log(
    "HTTP: auth, CRUD dos quatro recursos, FK/cascata/restrição, isolamento A/B, CSRF e falha de persistência aprovados.",
  );
}
async function collectionTests() {
  const collection = require("../docs/postman/Taskly-Etapa-07.postman_collection.json");
  const variables = Object.fromEntries(collection.variable.map(({key,value})=>[key,value]));
  variables.email = "collection@stage07.invalid";
  variables.password = crypto.randomBytes(16).toString("hex");
  assert.equal(collection.item.length,5);
  for (const folder of collection.item) {
    for (const item of folder.item) {
      const substitute = value => value.replace(/{{(\w+)}}/g,(_,key)=>variables[key]);
      const url = substitute(item.request.url).slice(base.length);
      const body = item.request.body ? JSON.parse(substitute(item.request.body.raw)) : undefined;
      const source = item.event[0].script.exec;
      const status = Number(source[0].match(/status\((\d+)\)/)[1]);
      const value = await http("collection", item.request.method,url,status,body);
      const pm = {test:(_name,callback)=>callback(),response:{code:status,json:()=>value,to:{have:{status:code=>assert.equal(code,status)}}},collectionVariables:{set:(key,value)=>{variables[key]=value;}}};
      Function("pm",source.join("\n"))(pm);
    }
  }
  console.log("Coleção Postman: cinco grupos, todas as requisições e scripts de IDs executados por HTTP.");
}
async function browserTests() {
  const { chromium } = require("playwright");
  fs.mkdirSync(evidence, { recursive: true });
  browser = await chromium.launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true,
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  const pageErrors = [];
  page.on("pageerror", (e) => pageErrors.push(e.message));
  const screenshot = (name) =>
    page.screenshot({ path: path.join(evidence, name), fullPage: true });
  await page.goto(origin + "/atividades");
  await page.waitForURL("**/login");
  await page.getByRole("link", { name: "Criar conta" }).click();
  const email = "interface@stage07.invalid",
    password = crypto.randomBytes(16).toString("hex");
  await page.getByLabel("Nome", { exact: true }).fill("Estudante Taskly");
  await page.getByLabel("E-mail", { exact: true }).fill(email);
  await page.getByLabel("Senha", { exact: true }).fill(password);
  await page.getByLabel("Confirmar senha", { exact: true }).fill(password);
  // Screenshot com formulário vazio: nenhuma senha de teste é registrada como evidência.
  await page.getByLabel("Senha", { exact: true }).fill("");
  await page.getByLabel("Confirmar senha", { exact: true }).fill("");
  await screenshot("01-cadastro.png");
  await page.getByLabel("Senha", { exact: true }).fill(password);
  await page.getByLabel("Confirmar senha", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Cadastrar", exact: true }).click();
  await page.waitForURL("**/login");
  await screenshot("02-login.png");
  await page.getByLabel("E-mail", { exact: true }).fill(email);
  await page.getByLabel("Senha", { exact: true }).fill("senha incorreta");
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await page.getByRole("alert").waitFor();
  await page.getByLabel("Senha", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await page.getByRole("heading", { name: "Dashboard", exact: true }).waitFor();
  const cookie = (await context.cookies()).find(
    (c) => c.name === "taskly_session",
  );
  assert.ok(cookie && cookie.httpOnly && cookie.sameSite === "Lax");
  assert.equal(await page.evaluate(() => localStorage.length), 0);
  await page.getByRole("link", { name: "Disciplinas", exact: true }).click();
  await page
    .getByLabel("Nome", { exact: true })
    .fill("Tecnologia de Construção de Software I");
  await page.getByLabel("Professor", { exact: true }).fill("Professor João");
  await page.getByRole("button", { name: "Salvar", exact: true }).click();
  await page.getByText("Registro salvo.", { exact: true }).waitFor();
  await screenshot("04-disciplinas.png");
  await page.getByRole("button", { name: "Editar", exact: true }).click();
  await page
    .getByLabel("Professor", { exact: true })
    .fill("Professor atualizado");
  await page.getByRole("button", { name: "Salvar", exact: true }).click();
  await page.getByText("Professor atualizado", { exact: true }).waitFor();

  await page.getByRole("link", { name: "Categorias", exact: true }).click();
  await page.getByLabel("Nome", { exact: true }).fill("Seminário");
  await page.getByRole("button", { name: "Salvar", exact: true }).click();
  await page.getByRole("heading", { name: "Seminário", exact: true }).waitFor();
  await screenshot("05-categorias.png");
  await page.getByRole("link", { name: "Atividades", exact: true }).click();
  await page.getByRole("link", { name: "Nova atividade", exact: true }).click();
  await page
    .getByRole("button", { name: "Salvar atividade", exact: true })
    .click();
  assert.equal(await page.locator(".field-error").count(), 4);
  await page
    .getByLabel("Título", { exact: true })
    .fill("Projeto de Banco de Dados");
  await page
    .getByLabel("Disciplina", { exact: true })
    .selectOption({ label: "Tecnologia de Construção de Software I" });
  await page
    .getByLabel("Categoria", { exact: true })
    .selectOption({ label: "Projeto" });
  await page
    .getByLabel("Descrição", { exact: true })
    .fill("Implementar e validar a persistência com SQLite.");
  await page.getByLabel("Prazo", { exact: true }).fill("2026-12-10");
  await page.getByLabel("Prioridade", { exact: true }).selectOption("HIGH");
  await page
    .getByRole("button", { name: "Salvar atividade", exact: true })
    .click();
  await page.getByRole("link", { name: "Ver detalhes", exact: true }).click();
  await page
    .getByRole("link", { name: "Editar atividade", exact: true })
    .click();
  await page
    .getByLabel("Título", { exact: true })
    .fill("Projeto SQLite persistente");
  await page
    .getByRole("button", { name: "Salvar atividade", exact: true })
    .click();
  await page.getByText("Atividade atualizada.", { exact: false }).waitFor();
  await page.getByRole("link", { name: "Ver detalhes", exact: true }).click();
  await page
    .getByLabel("Título da subtarefa", { exact: true })
    .fill("Criar modelo entidade-relacionamento");
  await page
    .getByRole("button", { name: "Adicionar subtarefa", exact: true })
    .click();
  await page.getByRole("checkbox").click();
  await page.getByText("Subtarefa atualizada.", { exact: true }).waitFor();
  await screenshot("07-detalhes-subtarefas.png");
  const detailUrl = page.url();
  await page.getByRole("link", { name: "Atividades", exact: true }).click();
  await page
    .getByRole("heading", { name: "Projeto SQLite persistente", exact: true })
    .waitFor();
  await screenshot("06-atividades.png");
  await page.getByLabel("Buscar atividade", { exact: true }).fill("sqlite");
  await page.getByText("1 item", { exact: true }).waitFor();
  await page.getByLabel("Prioridade", { exact: true }).selectOption("HIGH");
  await page.getByText("1 item", { exact: true }).waitFor();
  await page
    .getByRole("button", { name: "Limpar filtros", exact: true })
    .click();
  await page.getByRole("link", { name: "Dashboard", exact: true }).click();
  await screenshot("03-dashboard.png");
  await stop();
  await start();
  await page.goto(detailUrl);
  await page
    .getByRole("heading", { name: "Projeto SQLite persistente", exact: true })
    .waitFor();
  assert.equal(await page.getByRole("checkbox").isChecked(), true);
  await screenshot("09-persistencia-reinicio.png");
  for (const size of [
    { width: 768, height: 1024 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(size);
    for (const route of [
      "/",
      "/atividades",
      "/disciplinas",
      "/categorias",
      new URL(detailUrl).pathname,
      "/atividades/nova",
    ]) {
      await page.goto(origin + route);
      await page.locator("main h1").waitFor();
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        route + " " + size.width,
      );
    }
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(detailUrl);
  await page
    .getByRole("button", { name: "Excluir subtarefa", exact: true })
    .click();
  await page
    .getByText("Nenhuma subtarefa cadastrada.", { exact: true })
    .waitFor();
  await page
    .getByRole("button", { name: "Excluir atividade", exact: true })
    .click();
  await page.waitForURL("**/atividades");
  await page.getByRole("button", { name: "Sair", exact: true }).click();
  await page.waitForURL("**/login");
  await page.goto(origin + "/categorias");
  await page.waitForURL("**/login");
  assert.deepEqual(pageErrors, []);
  console.log(
    "Chrome: cadastro/login/erro/logout, proteção, disciplinas/categorias, atividade criada/editada/excluída, subtarefas e persistência após reinício aprovados.",
  );
  console.log(
    "Oito capturas reais; captura gráfica no Postman não automatizada (coleção exercitada por HTTP separadamente).",
  );
}
(async () => {
  try {
    await apiTests();
    await collectionTests();
    await browserTests();
    console.log("Verificações HTTP diretas aprovadas: " + checks);
  } finally {
    await stop();
    if (connection) connection.close();
    if (browser) await browser.close();
    fs.rmSync(directory, { recursive: true, force: true });
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
