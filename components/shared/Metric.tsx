import Image from "next/image";
import Link from "next/link";

interface MetricProps {
  imgUrl: string;
  alt: string;
  value: string | number;
  title: string;
  href?: string;
  textStyles?: string;
  isAuthor?: boolean;
};

const Metric = ({ imgUrl, alt, value, title, href, textStyles, isAuthor }: MetricProps) => {
  const MetricContent = (
    <>
      <Image
        src={imgUrl}
        alt={alt}
        width={16}
        height={16}
        className={`object-contain ${href && 'rounded-full'}`}
      />
      <p className={`${textStyles} flex items-baseline gap-1`}>
        {/* <span className={`${(typeof value === 'string' && value.length > 15) && 'line-clamp-1'}`}>
          {value}
        </span> */}
        {value}
        <span className={`small-regular line-clamp-1 ${isAuthor && 'max-sm:hidden'}`}>
          {title}
        </span>
      </p>
    </>
  );
  if(href) {
    return (
      <Link href={href} className="flex-center gap-1">
        {MetricContent}
      </Link>
    )
  }
  return (
    <div className="flex-center flex-wrap gap-1">
      {MetricContent}
    </div>
  );
};

export default Metric;