const $ = (s, r = document) => r.querySelector(s);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;
const CFG = window.NEXXA_CONFIG || {};

/* ---------- Conversas simuladas (dados fictícios) ---------- */
const cenas = {
  agendar: [["p","Oi, vocês atendem dermatologia? Quero marcar uma consulta."],
    ["n","Olá! Sou a assistente virtual do consultório. Posso ajudar com agendamento e informações. Para falar com uma pessoa, digite 1."],
    ["n","Tenho estes horários:\nA) 12/11 às 09:00\nB) 12/11 às 15:30\nC) 13/11 às 10:00\nResponda com a letra do horário."],
    ["p","B"],["n","Agendado para 12/11 às 15:30. Posso ajudar em mais alguma coisa?"]],
  lembrete: [["n","Lembrete: sua consulta é amanhã, 12/11 às 15:30. Responda A para confirmar ou B para remarcar."],
    ["p","A"],["n","Consulta confirmada. Leve um documento com foto e a carteirinha do convênio."],
    ["p","Qual o endereço?"],["n","Rua Exemplo, 100, Sorocaba-SP."]],
  urgencia: [["p","Estou com falta de ar e dor no peito"],
    ["n","Isso pode ser uma urgência. Ligue 192 (SAMU) ou vá ao pronto-socorro mais próximo."],
    ["a","Regra fixa: equipe do consultório alertada e conversa passada para uma pessoa"]]
};
const hero = [["p","Boa noite! Têm horário essa semana?"],["n","Boa noite! Tenho quarta às 10h e sexta às 14h. Qual prefere?"],["p","Sexta"],["n","Pronto, agendado para sexta, 14h."]];

async function tocar(box, msgs, tk) {
  const id = tk.id; box.innerHTML = "";
  for (const [q, t] of msgs) {
    if (tk.id !== id) return;
    let d;
    if (!reduz) { if (q === "n") { d = document.createElement("div"); d.className = "typing"; d.innerHTML = "<i></i><i></i><i></i>"; box.append(d); await sleep(850); } else await sleep(650); }
    if (d) d.remove();
    if (tk.id !== id) return;
    const m = document.createElement("div"); m.className = "m " + q; m.textContent = t; box.append(m);
  }
}
const PAINEL = `<div class="panel" aria-label="Prévia ilustrativa do painel">
<h4>Conversas</h4>
<div class="row"><span>Paciente A <small>quer agendar</small></span><span class="tag">IA atendendo</span></div>
<div class="row"><span>Paciente B <small>pediu atendente</small></span><span class="tag w">Equipe assumiu</span></div>
<div class="row"><span>Paciente C <small>aguardando horário</small></span><span class="tag">IA atendendo</span></div>
<h4>Agenda de hoje</h4>
<div class="row"><span>09:00 <small>Consulta</small></span><span class="tag">Confirmada</span></div>
<div class="row"><span>15:30 <small>Consulta</small></span><span class="tag w">A confirmar</span></div></div>`;
const tk = { id: 0 }, box = $("#demoBox");
function demo(k) {
  tk.id++;
  if (k === "painel") { box.innerHTML = PAINEL; return; }
  box.innerHTML = '<div class="chat" id="demoChat" aria-live="polite"></div>';
  tocar($("#demoChat"), cenas[k], tk);
}
$("#tabs").addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return;
  document.querySelectorAll("#tabs button").forEach(x => x.setAttribute("aria-selected", x === b));
  demo(b.dataset.k);
});
(async () => { const t = { id: 0 }; do { await tocar($("#heroChat"), hero, t); if (reduz) break; await sleep(5000); } while (true); })();
let ini = false;
new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting && !ini) { ini = true; demo("agendar"); o.disconnect(); } }), { threshold: .25 }).observe($("#demo"));

/* ---------- Revelar ao rolar ---------- */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("v"); io.unobserve(e.target); } }), { threshold: .12 });
document.querySelectorAll(".rv").forEach(el => io.observe(el));

/* ---------- Menu e navbar ---------- */
$("#burger").addEventListener("click", () => { const o = $("#menu").classList.toggle("open"); $("#burger").setAttribute("aria-expanded", o); });
$("#menu").addEventListener("click", e => { if (e.target.closest("a,button")) { $("#menu").classList.remove("open"); $("#burger").setAttribute("aria-expanded", "false"); } });
addEventListener("scroll", () => $("#nav").classList.toggle("s", scrollY > 10), { passive: true });
$("#ano").textContent = new Date().getFullYear();

/* ---------- Formulário ---------- */
const dlg = $("#dlg"), form = $("#form"), status = $("#status"), btn = $("#enviar"), corpo = form.parentElement;
document.querySelectorAll("[data-open]").forEach(b => b.addEventListener("click", () => { dlg.showModal(); form.elements.nome.focus(); }));
$("#fechar").addEventListener("click", () => dlg.close());
dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });

const regras = {
  nome: v => v.trim().length >= 2 || "Informe o seu nome.",
  clinica: v => v.trim().length >= 2 || "Informe o nome do consultório ou clínica.",
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || "Informe um e-mail válido.",
  especialidade: v => v.trim().length >= 2 || "Informe a especialidade."
};
function validar() {
  let ok = true;
  for (const [n, fn] of Object.entries(regras)) {
    const el = form.elements[n], r = fn(el.value), err = el.parentElement.querySelector(".err");
    el.setAttribute("aria-invalid", r !== true); err.textContent = r === true ? "" : r;
    if (r !== true && ok) { el.focus(); ok = false; }
  }
  return ok;
}
form.addEventListener("input", e => { if (e.target.getAttribute("aria-invalid")) { e.target.removeAttribute("aria-invalid"); const s = e.target.parentElement.querySelector(".err"); if (s) s.textContent = ""; } });
function msg(t, c) { status.textContent = t; status.className = "status " + (c || ""); }
function sucesso(texto) {
  corpo.innerHTML = `<div class="done"><svg class="ic"><use href="#i-shield"/></svg><h2>Solicitação recebida</h2><p>${texto}</p><button class="btn ghost" style="margin-top:20px" onclick="document.getElementById('dlg').close()">Fechar</button></div>`;
}
form.addEventListener("submit", async e => {
  e.preventDefault(); msg("");
  if (form.elements.website.value) return;                 // honeypot: ignora robôs
  if (!validar()) return;
  const d = Object.fromEntries(new FormData(form)); delete d.website;
  if (CFG.formEndpoint) {
    btn.disabled = true; btn.textContent = "Enviando..."; msg("Enviando sua solicitação...");
    try {
      const r = await fetch(CFG.formEndpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(d) });
      if (!r.ok) throw new Error(r.status);
      sucesso("Recebemos os seus dados e entraremos em contato por e-mail para combinar a demonstração.");
    } catch { msg("Não foi possível enviar agora. Verifique a conexão e tente novamente.", "bad"); btn.disabled = false; btn.textContent = "Enviar solicitação"; }
  } else if (CFG.whatsappNumber) {
    const t = `Olá! Quero solicitar uma demonstração da Nexxa.\nNome: ${d.nome}\nConsultório: ${d.clinica}\nE-mail: ${d.email}\nEspecialidade: ${d.especialidade}` + (d.necessidade ? `\nNecessidade: ${d.necessidade}` : "");
    window.open(`https://wa.me/${CFG.whatsappNumber}?text=${encodeURIComponent(t)}`, "_blank", "noopener");
    sucesso("Abrimos o WhatsApp com a sua mensagem pronta. É só enviar para concluir a solicitação.");
  } else {
    msg("O formulário ainda não está conectado. Configure js/config.js (formEndpoint ou whatsappNumber).", "bad");
  }
});
