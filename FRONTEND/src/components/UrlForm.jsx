import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";

import { createShortUrl } from "../api/shortUrl.api";

const UrlForm = ({ compact = false }) => {
  const [url, setUrl] = useState("https://www.example.com");
  const [slug, setSlug] = useState("");
  const [shortResult, setShortResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const queryClient = useQueryClient();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const createMutation = useMutation({
    mutationFn: createShortUrl,
    onSuccess: async (data) => {
      setShortResult(data);
      setSlug("");
      await queryClient.invalidateQueries({ queryKey: ["userUrls"] });
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    createMutation.mutate({
      url,
      slug: slug.trim() || undefined,
    });
  };

  const onCopy = async () => {
    if (!shortResult?.shortUrl) {
      return;
    }

    await navigator.clipboard.writeText(shortResult.shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <section className={`glass-card rounded-3xl border p-5 sm:p-6 ${compact ? "" : "fade-up"}`}>
      <h2 className="text-xl font-bold text-[var(--ink-1)] sm:text-2xl">Create a smart short link</h2>
      <p className="mt-1 text-sm text-[var(--ink-2)]">
        Fast redirects, secure cookies, and analytics-ready links.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 grid gap-3">
        <div>
          <label htmlFor="url" className="mb-1 block text-sm font-semibold text-[var(--ink-1)]">
            Destination URL
          </label>
          <input
            id="url"
            type="url"
            className="input"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://your-site.com/awesome-page"
            required
          />
        </div>

        {isAuthenticated && (
          <div>
            <label htmlFor="slug" className="mb-1 block text-sm font-semibold text-[var(--ink-1)]">
              Custom slug (optional)
            </label>
            <input
              id="slug"
              type="text"
              className="input"
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              placeholder="my-campaign"
              minLength={4}
              maxLength={32}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={createMutation.isPending}
          className="action-btn mt-1 bg-[linear-gradient(100deg,var(--accent-1),var(--accent-2),var(--accent-3))] text-white disabled:cursor-not-allowed disabled:opacity-65"
        >
          {createMutation.isPending ? "Generating..." : "Generate short URL"}
        </button>
      </form>

      {createMutation.isError && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {createMutation.error.message}
        </p>
      )}

      {shortResult?.shortUrl && (
        <div className="mt-5 rounded-xl border border-[rgba(20,33,61,0.15)] bg-white/85 p-3 sm:p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-2)]">Your short URL</p>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
            <a
              href={shortResult.shortUrl}
              target="_blank"
              rel="noreferrer"
              className="truncate text-sm font-semibold text-[var(--accent-2)] underline-offset-2 hover:underline"
            >
              {shortResult.shortUrl}
            </a>
            <button
              type="button"
              onClick={onCopy}
              className="action-btn bg-[var(--ink-1)] px-3 py-1.5 text-xs text-white sm:ml-auto"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default UrlForm;
