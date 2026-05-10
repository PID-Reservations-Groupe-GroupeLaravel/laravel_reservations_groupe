function Section({ title, children }) {
  return (
    <section>
      <h2 className="text-xl font-bold mb-4"
        style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#0a0d2e' }}>
        {title}
      </h2>
      <div className="text-sm leading-relaxed space-y-3"
        style={{ fontFamily: 'Manrope, sans-serif', color: '#454652', lineHeight: 1.9 }}>
        {children}
      </div>
    </section>
  )
}

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen" style={{ background: '#f7f9fc' }}>
      <div className="py-16 px-6 text-center"
        style={{ background: 'linear-gradient(135deg, #000666 0%, #1a237e 100%)' }}>
        <p className="text-xs font-bold uppercase tracking-[0.25em] mb-3"
          style={{ color: '#fdd400', fontFamily: 'Manrope, sans-serif' }}>
          Informations légales
        </p>
        <h1 className="text-4xl font-extrabold text-white mb-3"
          style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
          Mentions légales
        </h1>
        <p className="text-sm max-w-xl mx-auto"
          style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Manrope, sans-serif' }}>
          Dernière mise à jour : mai 2026
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12 space-y-10">

        <Section title="Éditeur du site">
          <p>Le site <strong>Ovatio.be</strong> est édité dans le cadre d'un projet pédagogique réalisé à l'<strong>ICCBXL</strong> (Institut Cardinal Mercier — site de Bruxelles), situé rue des Minimes 6, 1000 Bruxelles, Belgique.</p>
          <p>Responsables du projet : Soufiane Achraa, Salim El Ghalbzouri, Mehdi Chouati, Mohamed Minhas.</p>
          <p>Contact : <a href="mailto:contact@ovatio.be" className="underline" style={{ color: '#000666' }}>contact@ovatio.be</a></p>
        </Section>

        <Section title="Hébergement">
          <p>Ce site est hébergé localement dans le cadre d'un environnement de développement. En production, l'hébergement sera assuré par un prestataire certifié conforme au RGPD.</p>
        </Section>

        <Section title="Propriété intellectuelle">
          <p>L'ensemble des contenus présents sur Ovatio.be (textes, images, logos, descriptions de spectacles) est protégé par le droit d'auteur. Toute reproduction, même partielle, est interdite sans autorisation écrite préalable.</p>
          <p>Les visuels des spectacles sont la propriété de leurs producteurs respectifs et sont utilisés à titre illustratif dans un cadre pédagogique.</p>
        </Section>

        <Section title="Données personnelles (RGPD)">
          <p>Ovatio.be collecte les données suivantes lors de l'inscription : nom, prénom, adresse e-mail, pseudonyme et préférence de langue. Ces données sont utilisées exclusivement pour le fonctionnement du service.</p>
          <p>Conformément au <strong>Règlement Général sur la Protection des Données (RGPD)</strong> et à la loi belge du 30 juillet 2018, vous disposez d'un droit d'accès, de rectification et de suppression de vos données.</p>
          <p>Pour exercer ces droits, contactez-nous à : <a href="mailto:privacy@ovatio.be" className="underline" style={{ color: '#000666' }}>privacy@ovatio.be</a></p>
        </Section>

        <Section title="Cookies">
          <p>Ovatio.be utilise des cookies fonctionnels pour maintenir votre session et mémoriser vos préférences. Aucun cookie publicitaire ou de tracking tiers n'est utilisé. Consultez notre <a href="/cookies" className="underline" style={{ color: '#000666' }}>politique de cookies</a> pour plus d'informations.</p>
        </Section>

        <Section title="Limitation de responsabilité">
          <p>Ovatio.be est un projet étudiant à visée pédagogique. Les informations présentées (spectacles, disponibilités, tarifs) sont fictives ou illustratives et ne constituent pas une offre commerciale réelle.</p>
          <p>L'équipe ne pourra être tenue responsable d'éventuelles erreurs, omissions ou indisponibilités du service.</p>
        </Section>

        <Section title="Droit applicable">
          <p>Le présent site est soumis au droit belge. Tout litige relatif à son utilisation sera soumis aux tribunaux compétents de l'arrondissement judiciaire de Bruxelles.</p>
        </Section>

      </div>
    </div>
  )
}
