import React from 'react';
import Layout from '@theme/Layout';
import styles from './index.module.css';

const pillars = [
  {
    icon: '◈',
    title: 'Marketing',
    desc: 'Posicionamento, narrativa e campanhas que criam reconhecimento de marca duradouro.',
  },
  {
    icon: '◎',
    title: 'Growth',
    desc: 'Aquisição, ciclos experimentais e funis de conversão que geram receita previsível.',
  },
  {
    icon: '⬡',
    title: 'IA',
    desc: 'Agentes customizados, automações e sistemas internos — não add-ons genéricos.',
  },
];

const phases = [
  { label: 'Semana 1', title: 'Diagnóstico', desc: 'Conversa com Jimmy + validação humana para mapear o contexto real.' },
  { label: 'Semanas 2–3', title: 'Arquitetura', desc: 'Planejamento unificado onde marca, funil e IA trabalham em coesão.' },
  { label: 'Meses 1–3', title: 'Execução', desc: 'Sprints lean em ciclos de 2 semanas com entregas incrementais.' },
  { label: 'Mês 3+', title: 'Operação', desc: 'Funcionamento contínuo com agentes de IA embarcados no negócio.' },
];

export default function Home() {
  return (
    <Layout title="Trívia Studio" description="Marketing, Growth e IA no mesmo sistema.">
      <main className={styles.main}>

        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <p className={styles.eyebrow}>Trívia Studio</p>
            <h1 className={styles.heroTitle}>
              Três estradas.<br />
              <span className={styles.accent}>Marketing, growth e IA</span><br />
              no mesmo sistema.
            </h1>
            <p className={styles.heroSub}>
              Não vendemos horas. Entregamos sistemas que não precisam de nós para rodar.
            </p>
            <a
              href="https://triviastudio.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaBtn}
            >
              Começar pelo Jimmy →
            </a>
            <p className={styles.ctaMeta}>Diagnóstico gratuito · Proposta em 48h · Zero compromisso</p>
          </div>
          <div className={styles.heroBg} aria-hidden="true">
            <div className={styles.glow1} />
            <div className={styles.glow2} />
          </div>
        </section>

        {/* Pillars */}
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>O Trivium</h2>
            <p className={styles.sectionSub}>Três disciplinas. Uma arquitetura integrada.</p>
            <div className={styles.pillarsGrid}>
              {pillars.map((p) => (
                <div key={p.title} className={styles.pillarCard}>
                  <span className={styles.pillarIcon}>{p.icon}</span>
                  <h3 className={styles.pillarTitle}>{p.title}</h3>
                  <p className={styles.pillarDesc}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Differentiator */}
        <section className={styles.sectionDark}>
          <div className={styles.container}>
            <div className={styles.diffBlock}>
              <p className={styles.diffQuote}>
                "Não vendemos horas.<br />
                Vendemos <em>sistemas</em> que não precisam de nós para rodar."
              </p>
              <ul className={styles.diffList}>
                <li>Time pequeno orientado a sócios — cada projeto toca um principal</li>
                <li>Você recebe o código, os pesos e a documentação — a IA é sua</li>
                <li>Arquitetura integrada: marca, funil e IA em coesão, não em silos</li>
                <li>São Paulo · Lisboa · Cidade do México</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Process */}
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Como funciona</h2>
            <p className={styles.sectionSub}>Do diagnóstico à operação autônoma.</p>
            <div className={styles.phasesGrid}>
              {phases.map((ph, i) => (
                <div key={ph.title} className={styles.phaseCard}>
                  <span className={styles.phaseNumber}>{String(i + 1).padStart(2, '0')}</span>
                  <p className={styles.phaseLabel}>{ph.label}</p>
                  <h3 className={styles.phaseTitle}>{ph.title}</h3>
                  <p className={styles.phaseDesc}>{ph.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className={styles.ctaSection}>
          <div className={styles.container}>
            <h2 className={styles.ctaTitle}>Pronto para começar?</h2>
            <p className={styles.ctaSub}>
              Jimmy faz o briefing inicial em 7 minutos. Sem compromisso.
            </p>
            <a
              href="https://triviastudio.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaBtn}
            >
              Falar com Jimmy →
            </a>
          </div>
        </section>

      </main>
    </Layout>
  );
}
