"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { ModeToggle } from "@/components/theme-toggler";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { Authentication } from "@/lib/Auth/Authentication";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";

export function AppHeader() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Busca el email en la cookie (ajusta el nombre si es diferente)
    const email = localStorage.getItem("email");
    setUserEmail(email ?? null);
  }, []);
  const handleLogout = async () => {
    const auth = new Authentication();
    const { status, message } = await auth.logout();
    if (status !== 200) {
      toast.error(`Error al cerrar sesión: ${message}`);
      router.push("/login");
      return;
    }
    toast.success("Sesión cerrada correctamente");
    router.push("/login");
  };
  return (
    <header className="w-full bg-white dark:bg-zinc-900 border-b shadow-sm">
      <nav className="container mx-auto flex items-center h-16 px-4 gap-6 relative">
        {/* Logo a la izquierda */}
        <Link href="/" className="flex items-center gap-2 z-20">
          <Image
            src="/proplayas_logo.svg"
            alt="Proplayas Logo"
            width={40}
            height={40}
            className="rounded-full"
            priority
          />
          <span className="font-bold text-lg text-gray-700 dark:text-white">
            Proplayas
          </span>
        </Link>
        <div className="flex-1" />
        {/* Menú de navegación en desktop */}
        <nav className="hidden md:flex gap-6 items-center">
          <Link
            href="/"
            className="text-gray-700 dark:text-white hover:text-blue-600 transition font-medium"
          >
            Inicio
          </Link>
          <Link
            href="/public/quienes-somos"
            className="text-gray-700 dark:text-white hover:text-blue-600 transition font-medium"
          >
            Quienes Somos
          </Link>
          <Link
            href="/public/actividades/eventos"
            className="text-gray-700 dark:text-white hover:text-blue-600 transition font-medium"
          >
            Actividades
          </Link>
          <Link
            href="/public/nodos"
            className="text-gray-700 dark:text-white hover:text-blue-600 transition font-medium"
          >
            Nodos
          </Link>
          {userEmail ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  {userEmail}
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/perfil">Perfil</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="outline">
              <Link href="/login">Login</Link>
            </Button>
          )}
        </nav>
        <div>
          <ModeToggle />
        </div>
        {/* Dropdown menú en mobile */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="p-2 rounded-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                aria-label="Abrir menú"
              >
                <Menu size={28} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 mt-2">
              <DropdownMenuItem asChild>
                <Link href="/">Inicio</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/public/quienes-somos">Quienes Somos</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/public/actividades">Actividades</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/public/nodos">Nodos</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                {userEmail ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full flex items-center gap-2"
                      >
                        {userEmail}
                        <ChevronDown size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/perfil">Perfil</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogout}>
                        Cerrar sesión
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button asChild variant="outline">
                    <Link href="/login">Login</Link>
                  </Button>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
}
