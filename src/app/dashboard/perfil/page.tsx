"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import { SiteHeader } from "@/components/site-header";
import { ProfileService } from "@/lib/ProfileController";
import type { User } from "@/interfaces/Profile";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { IconPencil, IconWorld, IconPin } from "@tabler/icons-react";

// Puedes crear estos componentes modales como en el nodo, o usar los mismos si son genéricos
// import { EditProfileFormModal, EditProfileImageModal } from "@/components/Forms/profile/ProfileForm";

export default function Page() {
  const profileService = useMemo(() => new ProfileService(), []);
  const [user, setUser] = useState<User>();
  const [showEditInfo, setShowEditInfo] = useState(false);
  const [showEditImage, setShowEditImage] = useState(false);
  const [loading, setLoading] = useState(true);

  // Para la edición de datos personales
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const res = await profileService.fetchProfile();
      setUser(res?.data || undefined);
    } catch (err) {
      toast.error("Error al cargar el perfil");
    }
    setLoading(false);
  }, [profileService]);

  // Actualizar datos personales
  const handleSaveInfo = async (updated: Partial<User>) => {
    try {
      const res = await profileService.updateProfile(updated);
      setUser(res.data);
      toast.success("Perfil actualizado correctamente");
    } catch {
      toast.error("Error al actualizar el perfil");
    }
    setShowEditInfo(false);
  };

  // Actualizar imagen de perfil
  const handleUploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("profile_picture", file);
    try {
      const res = await profileService.uploadProfilePicture(formData);
      setUser(res.data);
      toast.success("Imagen de perfil actualizada");
    } catch {
      toast.error("Error al actualizar la imagen de perfil");
    }
    setShowEditImage(false);
  };

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2 mb-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="animate-spin h-8 w-8 text-gray-400 mb-2" />
              <span className="text-gray-500 dark:text-gray-400">Cargando perfil...</span>
            </div>
          ) : user ? (
            <div className="bg-white dark:bg-zinc-700 shadow-md rounded-lg p-6 grid grid-cols-1 md:grid-cols-[300px_minmax(600px,_1fr)] gap-6 relative">
              <div className="flex flex-col items-center md:items-start">
                <div className="relative w-32 h-32 md:w-48 md:h-48 group">
                  {user.profile_picture ? (
                    <Image
                      width={192}
                      height={192}
                      src={
                        typeof user.profile_picture === "string"
                          ? `${process.env.NEXT_PUBLIC_PROFILE_COVER_URL || ""}${user.profile_picture}`
                          : URL.createObjectURL(user.profile_picture as any)
                      }
                      alt="Foto de perfil"
                      className="w-full h-full rounded-full border-2 border-gray-300 object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-full border-2 border-gray-300">
                      <span className="text-gray-400">Sin foto</span>
                    </div>
                  )}
                  <button
                    onClick={() => setShowEditImage(true)}
                    className="absolute top-2 right-2 bg-white p-1 rounded-full shadow hover:bg-gray-100"
                  >
                    <IconPencil size={18} />
                  </button>
                </div>
                <div className="my-3 text-center md:text-left">
                  <h1 className="text-2xl font-semibold text-gray-500 dark:text-white">
                    {user.name}
                  </h1>
                  <p className="text-gray-400">@{user.username}</p>
                </div>
                <div className="flex gap-2 text-gray-500 dark:text-white">
                  <p>{user.degree}</p>
                  {user.postgraduate && <span>- {user.postgraduate}</span>}
                </div>
                <p className="text-gray-400 dark:text-white text-center md:text-left">
                  {user.email}
                </p>
                {/* País y ciudad */}
                <div className="flex flex-col gap-1 text-gray-500 dark:text-white mt-2">
                  <span>
                    <IconWorld size={16} className="inline mr-1" />
                    <span className="font-semibold">País:</span> {user.country}
                  </span>
                  <span>
                    <IconPin size={16} className="inline mr-1" />
                    <span className="font-semibold">Ciudad:</span> {user.city}
                  </span>
                </div>
              </div>

              <div className="flex flex-col justify-between relative">
                <div className="absolute top-4 right-4">
                  <button
                    onClick={() => setShowEditInfo(true)}
                    className="bg-white p-1 rounded-full shadow hover:bg-gray-100"
                  >
                    <IconPencil size={18} />
                  </button>
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-gray-500 dark:text-white">
                    Sobre mí
                  </h1>
                  <p className="text-gray-600 dark:text-white mt-2">
                    {user.about}
                  </p>
                  <div className="mt-4">
                    <h2 className="text-lg font-semibold text-gray-500 dark:text-white">
                      Área de experiencia
                    </h2>
                    <p className="text-gray-600 dark:text-white">{user.expertise_area}</p>
                  </div>
                  <div className="mt-4">
                    <h2 className="text-lg font-semibold text-gray-500 dark:text-white">
                      Trabajo de investigación
                    </h2>
                    <p className="text-gray-600 dark:text-white">{user.research_work}</p>
                  </div>
                </div>

                {user.social_media && user.social_media.length > 0 && (
                  <div className="mt-6">
                    <h2 className="text-lg font-semibold text-gray-500 dark:text-white">
                      Redes Sociales:
                    </h2>
                    <div className="flex flex-wrap gap-3 mt-2">
                      {user.social_media.map((link) => (
                        <a
                          key={link.platform + link.url}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-500 transition"
                        >
                          {link.platform}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400">
              No se pudo cargar el perfil.
            </div>
          )}
        </div>
      </div>
      {/* Modales de edición */}
      {/* 
      <EditProfileFormModal
        isOpen={showEditInfo}
        onClose={() => setShowEditInfo(false)}
        defaultValues={user}
        onSave={handleSaveInfo}
      />
      <EditProfileImageModal
        isOpen={showEditImage}
        onClose={() => setShowEditImage(false)}
        onUpload={handleUploadImage}
      />
      */}
    </>
  );
}