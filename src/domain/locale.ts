export type SupportedLocale = "en" | "pt";

export const DEFAULT_LOCALE: SupportedLocale = "en";
export const LOCALE_STORAGE_KEY = "share_dreams_locale";

export type LocaleCopy = {
  common: {
    appName: string;
    nav: {
      features: string;
      integrations: string;
      pricing: string;
      about: string;
      contact: string;
      login: string;
      startTrial: string;
    };
    language: {
      en: string;
      pt: string;
      switchToEnglish: string;
      switchToPortuguese: string;
    };
  };
  marketing: {
    eyebrow: string;
    heroTitle: string;
    heroSubtitle: string;
    primaryCta: string;
    secondaryCta: string;
    trustTitle: string;
    trustCopy: string;
    loopTitle: string;
    loopItems: [string, string, string, string, string];
    premiumTitle: string;
    premiumCopy: string;
  };
  dashboard: {
    navInsights: string;
    eyebrow: string;
    title: string;
    subtitle: string;
    newDream: string;
    formTitle: string;
    formPlaceholder: string;
    saveDream: string;
    metricDreams: string;
    metricTasks: string;
    metricLimit: string;
    limitOpen: string;
    limitReached: string;
    cardMeta: string;
    createdNow: string;
    cardCopy: string;
    openDream: string;
    seedDreamTitle: string;
  };
  dream: {
    backDashboard: string;
    viewInsights: string;
    eyebrow: string;
    defaultTitle: string;
    subtitle: string;
    tasksEyebrow: string;
    tasksTitle: string;
    newTask: string;
    taskLabel: string;
    saveTask: string;
    seedTask: string;
    checkinEyebrow: string;
    checkinTitle: string;
    progressLabel: string;
    nextStepsLabel: string;
    saveCheckin: string;
    checkinSaved: string;
    rewardEyebrow: string;
    rewardTitle: string;
    setReward: string;
    rewardLabel: string;
    saveReward: string;
    defaultReward: string;
  };
  insights: {
    backDashboard: string;
    eyebrow: string;
    title: string;
    subtitle: string;
    premiumActive: string;
    weeklyUsers: string;
    weeklyRetention: string;
    engagementScore: string;
    topEvents: string;
  };
  paywall: {
    title: string;
    description: string;
    cta: string;
  };
};

export const localeCopy: Record<SupportedLocale, LocaleCopy> = {
  en: {
    common: {
      appName: "Share Dreams",
      nav: {
        features: "Features",
        integrations: "Integrations",
        pricing: "Pricing",
        about: "About us",
        contact: "Contact",
        login: "Log in",
        startTrial: "Start Free Trial"
      },
      language: {
        en: "EN",
        pt: "PT",
        switchToEnglish: "Switch to English",
        switchToPortuguese: "Switch to Portuguese"
      }
    },
    marketing: {
      eyebrow: "SOFT COLLABORATION SYSTEM",
      heroTitle: "Turn shared dreams into small weekly wins",
      heroSubtitle:
        "Plan together, move one meaningful step per week, and keep momentum with calm, motivating progress.",
      primaryCta: "Start planning",
      secondaryCta: "See dashboard",
      trustTitle: "Built for steady progress",
      trustCopy:
        "A clear loop for dreams, tasks, check-ins, and rewards. Beautiful enough to revisit every week.",
      loopTitle: "Core loop",
      loopItems: [
        "Create one shared dream",
        "Break it into clear tasks",
        "Check in weekly",
        "Celebrate with a reward",
        "Repeat with confidence"
      ],
      premiumTitle: "Premium adds depth, not noise",
      premiumCopy:
        "Unlock advanced insights and richer AI suggestions while keeping the same focused workflow."
    },
    dashboard: {
      navInsights: "Insights",
      eyebrow: "Share Dreams MVP",
      title: "Your Dreams Dashboard",
      subtitle:
        "Turn one dream into clear next actions, combine weekly check-ins, and keep a visible reward for progress.",
      newDream: "New Dream",
      formTitle: "Dream title",
      formPlaceholder: "Ex: Move to a new role in 6 months",
      saveDream: "Save Dream",
      metricDreams: "active dreams",
      metricTasks: "free tasks per dream",
      metricLimit: "current plan limit",
      limitOpen: "available",
      limitReached: "reached",
      cardMeta: "MVP sample",
      createdNow: "Created now",
      cardCopy: "Next suggested action: pick one 10-minute task and log progress this week.",
      openDream: "Open Dream",
      seedDreamTitle: "Plan the first shared dream"
    },
    dream: {
      backDashboard: "Back to dashboard",
      viewInsights: "View insights",
      eyebrow: "Execution Plan",
      defaultTitle: "Shared dream",
      subtitle:
        "A clear structure to convert a dream into tasks, check-ins, and rewarding milestones.",
      tasksEyebrow: "Stages and tasks",
      tasksTitle: "Next actions",
      newTask: "New Task",
      taskLabel: "Task title",
      saveTask: "Save Task",
      seedTask: "Define the first weekly milestone",
      checkinEyebrow: "Weekly Check-in",
      checkinTitle: "Track progress",
      progressLabel: "Progress (%)",
      nextStepsLabel: "Next steps",
      saveCheckin: "Save Check-in",
      checkinSaved: "Check-in saved",
      rewardEyebrow: "Reward",
      rewardTitle: "Motivation Milestone",
      setReward: "Set Reward",
      rewardLabel: "Manual reward",
      saveReward: "Save Reward",
      defaultReward: "Simple dinner to celebrate the milestone"
    },
    insights: {
      backDashboard: "Back to dashboard",
      eyebrow: "Analytics MVP",
      title: "Engagement Overview",
      subtitle:
        "A simple reading of retention and activity to guide the next Share Dreams product iteration.",
      premiumActive: "Premium active",
      weeklyUsers: "Weekly Active Users",
      weeklyRetention: "Weekly Retention",
      engagementScore: "Engagement Score",
      topEvents: "Top events"
    },
    paywall: {
      title: "You have reached the Free plan limit",
      description: "Complete/archive an item or upgrade to Premium to keep creating dreams and tasks.",
      cta: "Upgrade to Premium"
    }
  },
  pt: {
    common: {
      appName: "Share Dreams",
      nav: {
        features: "Recursos",
        integrations: "Integrações",
        pricing: "Preços",
        about: "Sobre",
        contact: "Contato",
        login: "Entrar",
        startTrial: "Começar grátis"
      },
      language: {
        en: "EN",
        pt: "PT",
        switchToEnglish: "Mudar para inglês",
        switchToPortuguese: "Mudar para português"
      }
    },
    marketing: {
      eyebrow: "SISTEMA DE COLABORAÇÃO LEVE",
      heroTitle: "Transforme sonhos compartilhados em pequenas vitórias semanais",
      heroSubtitle:
        "Planejem juntos, avancem um passo importante por semana e mantenham o ritmo com progresso claro.",
      primaryCta: "Começar planejamento",
      secondaryCta: "Ver painel",
      trustTitle: "Criado para progresso constante",
      trustCopy:
        "Um ciclo claro para sonhos, tarefas, check-ins e recompensas. Bonito o suficiente para voltar toda semana.",
      loopTitle: "Loop principal",
      loopItems: [
        "Crie um sonho compartilhado",
        "Quebre em tarefas claras",
        "Faça check-in semanal",
        "Celebre com recompensa",
        "Repita com confiança"
      ],
      premiumTitle: "Premium adiciona profundidade sem ruído",
      premiumCopy:
        "Desbloqueie insights avançados e sugestões de IA mais ricas sem perder o fluxo simples."
    },
    dashboard: {
      navInsights: "Insights",
      eyebrow: "Share Dreams MVP",
      title: "Seu painel de sonhos",
      subtitle:
        "Transforme um sonho em próximas ações claras, combine check-ins semanais e mantenha uma recompensa visível.",
      newDream: "Novo sonho",
      formTitle: "Título do sonho",
      formPlaceholder: "Ex.: Mudar de emprego em 6 meses",
      saveDream: "Salvar sonho",
      metricDreams: "sonhos ativos",
      metricTasks: "tarefas Free por sonho",
      metricLimit: "limite atual do plano",
      limitOpen: "disponível",
      limitReached: "atingido",
      cardMeta: "Exemplo MVP",
      createdNow: "Criado agora",
      cardCopy: "Próxima ação sugerida: escolha uma tarefa de 10 minutos e registre o avanço semanal.",
      openDream: "Abrir sonho",
      seedDreamTitle: "Planejar o primeiro sonho compartilhado"
    },
    dream: {
      backDashboard: "Voltar ao painel",
      viewInsights: "Ver insights",
      eyebrow: "Plano de execução",
      defaultTitle: "Sonho compartilhado",
      subtitle:
        "Uma estrutura simples para transformar o sonho em tarefas, check-ins e marcos de recompensa.",
      tasksEyebrow: "Etapas e tarefas",
      tasksTitle: "Próximas ações",
      newTask: "Nova tarefa",
      taskLabel: "Título da tarefa",
      saveTask: "Salvar tarefa",
      seedTask: "Definir primeiro marco semanal",
      checkinEyebrow: "Check-in semanal",
      checkinTitle: "Registrar avanço",
      progressLabel: "Progresso (%)",
      nextStepsLabel: "Próximos passos",
      saveCheckin: "Registrar check-in",
      checkinSaved: "Check-in registrado",
      rewardEyebrow: "Recompensa",
      rewardTitle: "Marco de motivação",
      setReward: "Definir recompensa",
      rewardLabel: "Recompensa manual",
      saveReward: "Salvar recompensa",
      defaultReward: "Jantar simples para celebrar o marco"
    },
    insights: {
      backDashboard: "Voltar ao painel",
      eyebrow: "Analytics MVP",
      title: "Resumo de engajamento",
      subtitle:
        "Uma leitura simples de retenção e atividade para orientar a próxima iteração do Share Dreams.",
      premiumActive: "Premium ativo",
      weeklyUsers: "Usuários ativos semanais",
      weeklyRetention: "Retenção semanal",
      engagementScore: "Pontuação de engajamento",
      topEvents: "Eventos principais"
    },
    paywall: {
      title: "Você atingiu o limite do plano Free",
      description: "Finalize/arquive um item ou faça upgrade para Premium para continuar criando.",
      cta: "Fazer upgrade para Premium"
    }
  }
};

export function resolveLocale(input: unknown): SupportedLocale {
  if (typeof input !== "string") {
    return DEFAULT_LOCALE;
  }

  const normalizedInput = input.trim().toLowerCase();

  if (normalizedInput.startsWith("pt")) {
    return "pt";
  }

  if (normalizedInput.startsWith("en")) {
    return "en";
  }

  return DEFAULT_LOCALE;
}

export function getInitialLocale(persistedLocale: string | null | undefined): SupportedLocale {
  if (persistedLocale) {
    return resolveLocale(persistedLocale);
  }

  return DEFAULT_LOCALE;
}
