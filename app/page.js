const NOME_LOJA = process.env.NEXT_PUBLIC_NOME_LOJA || "Agendamento";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-2 p-8">
      <h1 className="text-2xl font-semibold">{NOME_LOJA}</h1>
      <p className="text-zinc-500">O app está no ar. ✅</p>
    </main>
  );
}
