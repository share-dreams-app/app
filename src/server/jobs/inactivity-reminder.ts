export function buildInactivityReminder(input: { dreamTitle: string }) {
  return `Você está sem atualizar o sonho "${input.dreamTitle}". Qual é a próxima ação de 10 minutos que você consegue concluir hoje?`;
}
