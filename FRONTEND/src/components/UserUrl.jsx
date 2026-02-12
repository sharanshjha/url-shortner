import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { deleteShortUrl } from "../api/shortUrl.api";
import { getAllUserUrls } from "../api/user.api";
import { PUBLIC_APP_URL } from "../utils/constants";

const UserUrl = () => {
  const [page, setPage] = useState(1);
  const [copiedId, setCopiedId] = useState(null);
  const queryClient = useQueryClient();

  const userUrlsQuery = useQuery({
    queryKey: ["userUrls", page],
    queryFn: () => getAllUserUrls({ page, limit: 12 }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteShortUrl,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["userUrls"] });
    },
  });

  const urls = userUrlsQuery.data?.urls || [];
  const pagination = userUrlsQuery.data?.pagination;

  const totalClicks = urls.reduce((sum, item) => sum + (item.clicks || 0), 0);

  const onCopy = async (code, id) => {
    await navigator.clipboard.writeText(`${PUBLIC_APP_URL}/${code}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  if (userUrlsQuery.isLoading) {
    return (
      <section className="glass-card mt-6 rounded-3xl p-5 sm:p-6">
        <p className="text-sm font-semibold text-[var(--ink-2)]">Loading your links...</p>
      </section>
    );
  }

  if (userUrlsQuery.isError) {
    return (
      <section className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Failed to load URLs: {userUrlsQuery.error.message}
      </section>
    );
  }

  if (!urls.length) {
    return (
      <section className="glass-card mt-6 rounded-3xl p-6 text-center">
        <h3 className="text-lg font-bold">No links yet</h3>
        <p className="mt-1 text-sm text-[var(--ink-2)]">Create your first short URL to start tracking clicks.</p>
      </section>
    );
  }

  return (
    <section className="glass-card fade-up mt-6 rounded-3xl p-5 sm:p-6">
      <div className="mb-5 grid gap-3 sm:grid-cols-2">
        <article className="rounded-xl border border-white/60 bg-white/85 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-2)]">Links on this page</p>
          <p className="mt-2 text-2xl font-bold">{urls.length}</p>
        </article>
        <article className="rounded-xl border border-white/60 bg-white/85 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-2)]">Total clicks</p>
          <p className="mt-2 text-2xl font-bold">{totalClicks}</p>
        </article>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/75 bg-white/90">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[rgba(20,33,61,0.06)] text-xs uppercase tracking-wide text-[var(--ink-2)]">
              <tr>
                <th className="px-4 py-3">Destination</th>
                <th className="px-4 py-3">Short</th>
                <th className="px-4 py-3">Clicks</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {urls.map((item) => (
                <tr key={item._id} className="border-t border-[rgba(20,33,61,0.08)] align-top">
                  <td className="max-w-[250px] px-4 py-3">
                    <a href={item.fullUrl} target="_blank" rel="noreferrer" className="truncate text-[var(--ink-1)] hover:underline">
                      {item.fullUrl}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={`${PUBLIC_APP_URL}/${item.shortCode}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-[var(--accent-2)] hover:underline"
                    >
                      {`${PUBLIC_APP_URL.replace(/^https?:\/\//, "")}/${item.shortCode}`}
                    </a>
                  </td>
                  <td className="px-4 py-3 font-semibold">{item.clicks}</td>
                  <td className="px-4 py-3 text-[var(--ink-2)]">{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => onCopy(item.shortCode, item._id)}
                        className="action-btn bg-[var(--ink-1)] px-3 py-1.5 text-xs text-white"
                      >
                        {copiedId === item._id ? "Copied" : "Copy"}
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteMutation.mutate(item._id)}
                        disabled={deleteMutation.isPending}
                        className="action-btn border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {pagination?.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-[var(--ink-2)]">
            Page {pagination.page} of {pagination.totalPages}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={pagination.page <= 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className="action-btn border border-[rgba(20,33,61,0.2)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--ink-1)] disabled:opacity-45"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className="action-btn border border-[rgba(20,33,61,0.2)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--ink-1)] disabled:opacity-45"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default UserUrl;
