"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const ESTADO_INICIAL = {
  nome: "",
  telefone: "",
  data: "",
  horario: "",
};

export default function AgendarPage() {
  const [form, setForm] = useState(ESTADO_INICIAL);
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((anterior) => ({ ...anterior, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setSucesso(false);

    // Validacao simples: os quatro campos sao obrigatorios.
    if (!form.nome || !form.telefone || !form.data || !form.horario) {
      setErro("Preencha todos os campos para confirmar o agendamento.");
      return;
    }

    setEnviando(true);

    const { error } = await supabase.from("agendamentos").insert({
      nome_cliente: form.nome,
      telefone: form.telefone,
      data: form.data,
      horario: form.horario,
    });

    setEnviando(false);

    if (error) {
      // Mostra a mensagem real do Supabase para facilitar o diagnostico.
      setErro(error.message);
      return;
    }

    setSucesso(true);
    setForm(ESTADO_INICIAL);
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-10 sm:py-16">
      <div className="mx-auto w-full max-w-md">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-zinc-900">Agende seu horário</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Preencha seus dados e confirme o agendamento.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-100"
        >
          <div>
            <label htmlFor="nome" className="mb-1 block text-sm font-medium text-zinc-700">
              Nome
            </label>
            <input
              id="nome"
              name="nome"
              type="text"
              value={form.nome}
              onChange={handleChange}
              required
              placeholder="Seu nome"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
            />
          </div>

          <div>
            <label htmlFor="telefone" className="mb-1 block text-sm font-medium text-zinc-700">
              Telefone
            </label>
            <input
              id="telefone"
              name="telefone"
              type="tel"
              inputMode="tel"
              value={form.telefone}
              onChange={handleChange}
              required
              placeholder="(00) 00000-0000"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label htmlFor="data" className="mb-1 block text-sm font-medium text-zinc-700">
                Data
              </label>
              <input
                id="data"
                name="data"
                type="date"
                value={form.data}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="horario" className="mb-1 block text-sm font-medium text-zinc-700">
                Horário
              </label>
              <input
                id="horario"
                name="horario"
                type="time"
                value={form.horario}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={enviando}
            className="w-full rounded-lg bg-zinc-900 px-4 py-2.5 font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {enviando ? "Enviando..." : "Confirmar agendamento"}
          </button>

          {sucesso && (
            <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700 ring-1 ring-green-100">
              Agendamento enviado com sucesso! Em breve confirmaremos seu horário.
            </p>
          )}

          {erro && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-100">
              {erro}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
