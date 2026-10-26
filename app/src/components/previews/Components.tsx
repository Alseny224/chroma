import { useState, type ReactNode } from 'react';
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Field,
  Input,
  Modal,
  Progress,
  Radio,
  Select,
  Switch,
  Table,
  Tabs,
  Textarea,
  Toast,
} from '../../kit/ui';

/** Vitrine du kit : exactement les composants et le CSS exportés. */
export function Components() {
  const [modal, setModal] = useState(false);
  const [toast, setToast] = useState(true);

  return (
    <div className="kit">
      <KitSection title="Boutons">
        <div className="kit-row">
          <Button>Primaire</Button>
          <Button variant="secondary">Secondaire</Button>
          <Button variant="outline">Contour</Button>
          <Button variant="ghost">Discret</Button>
          <Button variant="danger">Supprimer</Button>
          <Button variant="link">Lien</Button>
        </div>
        <div className="kit-row">
          <Button size="sm">Petit</Button>
          <Button>Moyen</Button>
          <Button size="lg">Grand</Button>
          <Button disabled>Désactivé</Button>
        </div>
      </KitSection>

      <KitSection title="Formulaire">
        <div className="kit-grid">
          <Field label="Nom complet" help="Tel qu’il apparaîtra sur la facture.">
            {(f) => <Input {...f} placeholder="Camille Laurent" />}
          </Field>
          <Field label="E-mail" error="Cette adresse n’est pas valide.">
            {(f) => <Input {...f} type="email" defaultValue="camille@" />}
          </Field>
          <Field label="Formule">
            {(f) => (
              <Select {...f} defaultValue="pro">
                <option value="solo">Solo</option>
                <option value="pro">Pro</option>
                <option value="equipe">Équipe</option>
              </Select>
            )}
          </Field>
          <Field label="Message">{(f) => <Textarea {...f} rows={3} placeholder="Ton message…" />}</Field>
        </div>
        <div className="kit-row">
          <Checkbox label="Recevoir la newsletter" defaultChecked />
          <Radio name="kit-freq" label="Mensuel" defaultChecked />
          <Radio name="kit-freq" label="Annuel" />
          <Switch label="Notifications" defaultChecked />
        </div>
      </KitSection>

      <KitSection title="Badges et alertes">
        <div className="kit-row">
          <Badge>Brouillon</Badge>
          <Badge tone="primary">Nouveau</Badge>
          <Badge tone="success">Payée</Badge>
          <Badge tone="warning">En attente</Badge>
          <Badge tone="danger">Échouée</Badge>
          <Badge tone="info">Bêta</Badge>
        </div>
        <div className="kit-grid">
          <Alert tone="info" title="Mise à jour disponible">La version 2.1 apporte l’export PDF.</Alert>
          <Alert tone="success" title="Paiement confirmé">Ton reçu a été envoyé par e-mail.</Alert>
          <Alert tone="warning" title="Quota presque atteint">Il te reste 2 projets sur 10.</Alert>
          <Alert tone="danger" title="Échec de la connexion">Vérifie ton mot de passe et réessaie.</Alert>
        </div>
      </KitSection>

      <KitSection title="Carte, onglets et tableau">
        <div className="kit-grid kit-grid--wide">
          <Card>
            <CardHeader title="Abonnement Pro" description="Facturé chaque mois, sans engagement." />
            <CardBody>
              <div className="kit-stack">
                <div className="kit-row kit-row--between">
                  <span>Stockage utilisé</span>
                  <strong>68 %</strong>
                </div>
                <Progress value={68} label="Stockage utilisé" />
                <div className="kit-row">
                  <Avatar name="Camille Laurent" />
                  <Avatar name="Hugo Martin" />
                  <Avatar name="Inès Bernard" />
                </div>
              </div>
            </CardBody>
            <CardFooter>
              <Button variant="ghost">Annuler</Button>
              <Button>Mettre à niveau</Button>
            </CardFooter>
          </Card>
          <Tabs
            label="Commandes"
            items={[
              {
                id: 'recentes',
                label: 'Récentes',
                content: (
                  <Table>
                    <thead>
                      <tr>
                        <th>N°</th>
                        <th>Client</th>
                        <th>Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>#4821</td>
                        <td>Camille Laurent</td>
                        <td>
                          <Badge tone="success">Livrée</Badge>
                        </td>
                      </tr>
                      <tr>
                        <td>#4820</td>
                        <td>Hugo Martin</td>
                        <td>
                          <Badge tone="warning">En cours</Badge>
                        </td>
                      </tr>
                      <tr>
                        <td>#4819</td>
                        <td>Inès Bernard</td>
                        <td>
                          <Badge tone="danger">Annulée</Badge>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                ),
              },
              { id: 'archives', label: 'Archivées', content: <p className="kit-muted">Aucune commande archivée.</p> },
              { id: 'stats', label: 'Statistiques', content: <p className="kit-muted">342 commandes ce mois-ci.</p> },
            ]}
          />
        </div>
      </KitSection>

      <KitSection title="Modale et notification">
        <div className="kit-row kit-row--start">
          <Button variant="outline" onClick={() => setModal(true)}>
            Ouvrir la modale
          </Button>
          {toast ? (
            <Toast tone="success" title="Projet enregistré" onClose={() => setToast(false)}>
              Tes modifications sont sauvegardées.
            </Toast>
          ) : (
            <Button variant="ghost" onClick={() => setToast(true)}>
              Réafficher la notification
            </Button>
          )}
        </div>
        <Modal
          open={modal}
          onClose={() => setModal(false)}
          title="Supprimer ce projet ?"
          footer={
            <>
              <Button variant="ghost" onClick={() => setModal(false)}>
                Annuler
              </Button>
              <Button variant="danger" onClick={() => setModal(false)}>
                Supprimer
              </Button>
            </>
          }
        >
          Cette action est définitive : les fichiers et l’historique du projet seront effacés.
        </Modal>
      </KitSection>
    </div>
  );
}

function KitSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="kit-section">
      <h3 className="kit-section__title">{title}</h3>
      {children}
    </section>
  );
}
