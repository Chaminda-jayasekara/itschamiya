type SmartImgProps = {
  src?: string | null;
  alt: string;
  className?: string;
};

// Plain <img>, not next/image — the URLs here (Google Drive, etc.) are
// arbitrary external hosts, and next/image requires each domain to be
// allow-listed in next.config.ts. If you standardize on one image host
// later, switch this to next/image for optimization.
export function SmartImg({ src, alt, className }: SmartImgProps) {
  if (!src) {
    return <div className={`bg-gray-100 ${className ?? ""}`} aria-label={alt} />;
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className={`object-cover ${className ?? ""}`} />;
}
