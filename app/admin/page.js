"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

// Formata "2026-06-25" como "25/06". Mantém simples; sem libs de data.
function formatarData(data) {
  if (!data) return "—";
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}`;
}

// Formata "14:30:00" (time do Postgres) como "14:30".
function formatarHorario(horario) {
  if (!horario) return "—";
  return horario.slice(0, 5);
}

// Cores do badge de status. Cai num cinza neutro pra status desconhecido.
function classesStatus(status) {
  const mapa = {
    confirmado: "bg-green-50 text-green-700 ring-green-100",
    pendente: "bg-amber-50 text-amber-700 ring-amber-100",
    cancelado: "bg-red-50 text-red-700 ring-red-100",
  };
  return mapa[status] ?? "bg-zinc-100 text-zinc-600 ring-zinc-200";
}

export default function AdminPage() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregar() {
      setErro("");
      setCarregando(true);

      // Lê todos os agendamentos, próximos primeiro (data e depois horário).
      const { data, error } = await supabase
        .from("agendamentos")
        .select("id, nome_cliente, telefone, data, horario, status")
        .order("data", { ascending: true })
        .order("horario", { ascending: true });

      setCarregando(false);

      if (error) {
        // Mostra a mensagem real do Supabase para facilitar o diagnóstico.
        setErro(error.message);
        return;
      }

      setAgendamentos(data ?? []);
    }

    carregar();
  }, []);

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-10 sm:py-16">
      <div className="mx-auto w-full max-w-2xl">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-900">Agendamentos</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Visão do barbeiro — próximos horários primeiro.
          </p>
        </header>

        {carregando && (
          <p className="rounded-lg bg-white px-4 py-3 text-sm text-zinc-500 shadow-sm ring-1 ring-zinc-100">
            Carregando agendamentos...
          </p>
        )}

        {!carregando && erro && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-100">
            {erro}
          </p>
        )}

        {!carregando && !erro && agendamentos.length === 0 && (
          <p className="rounded-lg bg-white px-4 py-8 text-center text-sm text-zinc-500 shadow-sm ring-1 ring-zinc-100">
            Nenhum agendamento ainda.
          </p>
        )}

        {!carregando && !erro && agendamentos.length > 0 && (
          <ul className="space-y-3">
            {agendamentos.map((item) => (
              <li
                key={item.id}
                className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-zinc-100"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-zinc-900">
                      {item.nome_cliente}
                    </p>
                    <p className="mt-0.5 text-sm text-zinc-500">{item.telefone}</p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${classesStatus(
                      item.status
                    )}`}
                  >
                    {item.status ?? "—"}
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-4 text-sm text-zinc-700">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="text-zinc-400">Data</span>
                    <span className="font-medium">{formatarData(item.data)}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="text-zinc-400">Horário</span>
                    <span className="font-medium">
                      {formatarHorario(item.horario)}
                    </span>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
