export default function Content({ children }: { children: React.ReactNode }) {
  return (
    <article className="prose prose-orange lg:prose-xl py-8 md:py-12">
      {children}
    </article>
  )
}