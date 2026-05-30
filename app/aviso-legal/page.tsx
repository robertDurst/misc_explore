import Link from "next/link";

export const metadata = {
  title: "Aviso legal",
  description:
    "Aviso legal y exención de responsabilidades de Café Azzurro — proyecto de aficionados sin afiliación oficial con la SSC Napoli.",
};

export default function AvisoLegal() {
  return (
    <main className="container article">
      <h1>Aviso legal</h1>
      <div className="prose">
        <h2>Sin afiliación oficial</h2>
        <p>
          <strong>Café Azzurro</strong> es un proyecto independiente de
          aficionados al SSC Napoli. No está asociado, patrocinado ni respaldado
          por la Società Sportiva Calcio Napoli S.p.A., ni por ninguna entidad
          oficial del club.
        </p>
        <p>
          Las marcas, escudos, nombres y logotipos mencionados pertenecen a sus
          respectivos titulares. El uso de la denominación &quot;Napoli&quot; y
          la referencia al año 1926 (fundación del club) se realiza con fines
          editoriales y de comentario sobre eventos de interés público.
        </p>

        <h2>Contenido y fuentes</h2>
        <p>
          Los datos de plantilla, calendario y resultados provienen de fuentes
          públicas (openfootball, Wikipedia, Wikimedia Commons). Los escudos de
          los clubes proceden de Wikimedia Commons y se utilizan en función
          identificativa-editorial. Cualquier inexactitud es responsabilidad de
          Café Azzurro, no de las fuentes.
        </p>

        <h2>Responsable editorial</h2>
        <p>
          Conforme al artículo 10 de la Ley 34/2002 (LSSI-CE), el responsable
          editorial de este sitio puede ser contactado en{" "}
          <code>rob@brickellresearch.org</code>.
        </p>

        <h2>Solicitudes de retirada</h2>
        <p>
          Si es titular de un derecho (marca, imagen, propiedad intelectual) y
          desea solicitar la modificación o retirada de algún contenido, escriba
          al correo indicado. Atenderemos la solicitud en un plazo razonable.
        </p>

        <h2>Sin garantía</h2>
        <p>
          La información publicada en Café Azzurro tiene carácter divulgativo.
          Hacemos lo posible por mantenerla precisa, pero no garantizamos su
          exactitud y no nos hacemos responsables de decisiones tomadas con base
          en ella.
        </p>

        <p>
          <Link className="back" href="/">← Volver al inicio</Link>
        </p>
      </div>
    </main>
  );
}
