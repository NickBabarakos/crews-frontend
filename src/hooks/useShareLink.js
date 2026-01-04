import { toast } from 'react-hot-toast';

export const useShareLink = () => {

    const shareLink = (crewId) => {
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('crew', crewId);
        const linkToCopy = currentUrl.toString();

        if(navigator.clipboard && navigator.clipboard.writeText){
            navigator.clipboard.writeText(linkToCopy)
                .then(()=> toast.success("Crew link copied to clipboard!"))
                .catch(()=> toast.error("Failed to copy link"));
        } else{
            try{
                const textArea = document.createElement("textarea");
                textArea.value=linkToCopy;

                textArea.style.position ="fixed";
                textArea.style.left="-9999px";
                textArea.style.top="0px";

                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();

                const successful = document.execCommand('copy');
                document.body.removeChild(textArea);

                if(successful){
                    toast.success("Crew link copied to clipboard");
                } else {
                    toast.error("Failed to copy link manually");
                }
            } catch(err){
                console.error('Faillback copy failed', err);
                toast.error("Browser blocked copy action");
            }
        }
    };
    return {shareLink};
};
