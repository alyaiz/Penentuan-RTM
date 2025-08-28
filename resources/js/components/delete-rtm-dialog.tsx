import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Rtm } from '@/types';
import { router } from '@inertiajs/react';
import { Loader2, Trash } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

type DeleteRtmDialogProps = {
    rtm: Rtm;
};

export default function DeleteRtmDialog({ rtm }: DeleteRtmDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleDelete = () => {
        setIsSubmitting(true);

        router.delete(`/rumah-tangga-miskin/${rtm.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Berhasil Dihapus', {
                    description: `Rumah tangga miskin "${rtm.name}" telah berhasil dihapus.`,
                });
            },
            onError: (err) => {
                const errorMessage = err.message || 'Terjadi kesalahan saat menghapus rumah tangga miskin.';
                const suggestion = err.suggestion || '';

                toast.error('Gagal Menghapus', {
                    description: suggestion ? `${errorMessage} ${suggestion}` : errorMessage,
                });
            },
            onFinish: () => {
                setIsSubmitting(false);
            },
        });
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline" size="icon" className="h-7 w-7 rounded-md">
                    <Trash className="size-3" />
                    <span className="sr-only">Tombol hapus rumah tangga miskin</span>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Hapus Rumah Tangga Miskin?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Apakah kamu yakin ingin menghapus rumah tangga miskin dengan nama <strong>{rtm.name}</strong>? Tindakan ini tidak dapat dibatalkan.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Menghapus...
                            </>
                        ) : (
                            'Ya, hapus'
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
