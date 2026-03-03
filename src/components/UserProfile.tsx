import { useState, useRef } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { supabase } from '../lib/supabase';
import { User, Upload, Loader2 } from 'lucide-react';

export function UserProfile() {
    const { user, initialize } = useAuthStore();
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const avatarUrl = user?.user_metadata?.avatar_url;

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setError(null);
            setUploading(true);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const filePath = `${user?.id}-${Math.random()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('profile-pictures')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage
                .from('profile-pictures')
                .getPublicUrl(filePath);

            const { error: updateError } = await supabase.auth.updateUser({
                data: { avatar_url: data.publicUrl }
            });

            if (updateError) {
                throw updateError;
            }

            // Refresh the user session in the store to get the new avatar_url
            await initialize();
        } catch (error: any) {
            setError(error.message);
            console.error('Error uploading image:', error);
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = ''; // Reset input
            }
        }
    };

    if (!user) return null;

    return (
        <div className="fixed top-6 right-6 z-50 animate-slide-in">
            <div className="glass-panel p-4 flex flex-col items-center space-y-3">
                <div className="relative group">
                    {avatarUrl ? (
                        <img
                            src={avatarUrl}
                            alt="Profile"
                            className="w-16 h-16 rounded-full object-cover border-2 border-primary/20 shadow-md"
                        />
                    ) : (
                        <div className="w-16 h-16 rounded-full bg-secondary-light/30 border-2 border-primary/20 flex items-center justify-center shadow-md">
                            <User className="text-secondary-gray w-8 h-8" />
                        </div>
                    )}

                    {uploading && (
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <Loader2 className="w-6 h-6 text-white animate-spin" />
                        </div>
                    )}
                </div>

                <div className="flex flex-col items-center">
                    <p className="text-sm font-medium text-main-dark mb-2 max-w-[120px] truncate" title={user.email}>
                        {user.email?.split('@')[0]}
                    </p>

                    <button
                        onClick={handleUploadClick}
                        disabled={uploading}
                        className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 transition-all w-full justify-center"
                    >
                        <Upload size={14} />
                        <span>Upload Picture</span>
                    </button>

                    {error && (
                        <p className="text-red-500 text-[10px] mt-2 text-center max-w-[140px] leading-tight break-words">
                            {error}
                        </p>
                    )}
                </div>

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="hidden"
                />
            </div>
        </div>
    );
}
