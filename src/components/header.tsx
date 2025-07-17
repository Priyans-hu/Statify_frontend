import Link from 'next/link';

export default function Header() {
  return (
    <nav className='p-4 flex gap-6 shadow border-b'>
      <Link href='/' className='font-bold'>
        Home
      </Link>
      <Link href='/status'>Status</Link>
      <Link href='/dashboard'>Dashboard</Link>
    </nav>
  );
}
