"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/marketplace');
  }, [router]);

  return (
    <main className="grid place-items-center h-screen">
      <div className="text-center">
        <div className="animate-bounce">
          <Image
            src="/logo.png"
            alt="Logo cargando"
            width={100}
            height={100}
            className="animate-spin"
            priority
          />
        </div>
        <h1 className="mt-4 text-xl font-semibold">Cargando...</h1>
      </div>
    </main>
  );
}
