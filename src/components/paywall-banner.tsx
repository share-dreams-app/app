export function PaywallBanner() {
  return (
    <aside
      aria-label="Limite do plano Free"
      style={{
        border: "1px solid #d97706",
        borderRadius: "18px",
        background: "#fffbeb",
        color: "#78350f",
        padding: "18px",
        boxShadow: "0 14px 30px rgba(120, 53, 15, 0.10)"
      }}
    >
      <strong style={{ display: "block", marginBottom: "6px" }}>
        Você atingiu o limite do plano Free
      </strong>
      <span>
        Finalize um sonho/tarefa ou faça upgrade para Premium para continuar criando.
      </span>
      <a
        href="/insights?plan=premium"
        style={{
          display: "inline-flex",
          marginTop: "12px",
          color: "#92400e",
          fontWeight: 700
        }}
      >
        Fazer upgrade para Premium
      </a>
    </aside>
  );
}
