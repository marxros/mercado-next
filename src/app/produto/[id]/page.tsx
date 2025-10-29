export default function ProductDetailPage({ params }: { params: { id: string } }) {
  return (
    <article>
      <h1>Produto {params.id}</h1>
      <p>TODO: Implementar fetch de produto</p>
    </article>
  );
}


