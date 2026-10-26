import type { CSSProperties } from 'react';
import { Alert, Avatar, Badge, Button, Card, CardBody, CardFooter, CardHeader, Field, Input, Progress, Switch } from '../kit/ui';
import { systemVars, type DesignSystem, type Mode } from '../lib/system';

/** Le vrai kit exporté, dans les couleurs de la démo du hero. */
export function KitShowcase({ sys, mode }: { sys: DesignSystem; mode: Mode }) {
  return (
    <div className="kit-stage" style={systemVars(sys, mode) as CSSProperties} data-theme={mode}>
      <div className="kit-stage__col">
        <span className="kit-stage__label">Boutons</span>
        <div className="kit-stage__row">
          <Button>Primaire</Button>
          <Button variant="secondary">Secondaire</Button>
          <Button variant="outline">Contour</Button>
        </div>
        <span className="kit-stage__label">Badges</span>
        <div className="kit-stage__row">
          <Badge tone="primary">Nouveau</Badge>
          <Badge tone="success">Payée</Badge>
          <Badge tone="warning">En attente</Badge>
          <Badge tone="danger">Échouée</Badge>
        </div>
        <Alert tone="success" title="Paiement confirmé">
          Ton reçu a été envoyé par e-mail.
        </Alert>
      </div>

      <div className="kit-stage__col">
        <Field label="E-mail" help="On ne le partagera jamais.">
          {(f) => <Input {...f} type="email" placeholder="camille@exemple.fr" />}
        </Field>
        <Field label="Code promo" error="Ce code a expiré.">
          {(f) => <Input {...f} defaultValue="AUTOMNE24" />}
        </Field>
        <Switch label="Recevoir les nouveautés" defaultChecked />
      </div>

      <div className="kit-stage__col">
        <Card>
          <CardHeader title="Abonnement Pro" description="Sans engagement." />
          <CardBody>
            <div className="kit-stage__stack">
              <div className="kit-stage__between">
                <span>Stockage</span>
                <strong>68 %</strong>
              </div>
              <Progress value={68} label="Stockage utilisé" />
              <div className="kit-stage__row">
                <Avatar name="Camille Laurent" />
                <Avatar name="Hugo Martin" />
                <Avatar name="Inès Bernard" />
              </div>
            </div>
          </CardBody>
          <CardFooter>
            <Button variant="ghost" size="sm">
              Plus tard
            </Button>
            <Button size="sm">Passer Pro</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
