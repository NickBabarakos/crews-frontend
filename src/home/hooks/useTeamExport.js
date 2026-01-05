/**
 * HOOK: Team Export Service
 * -------------------------
 * Converts the hidden DOM node (ExportPreview) into a PNG image.
 * 
 * SEQUENCE DIAGRAM (Mermaid):
 * ---------------------------
 * ```
 * mermaid
 * sequenceDiagram
 *      User ->>TriggerExport: Clicks Export
 *      TriggerExport->>DOM: Wait for Render (300ms)
 *      TriggerExport->>Images: Force Load & Decode (Promise.all)
 *      TriggerExport->>HTML-to-Image: Convert DOM to Canvas
 *      HTML-to-Image->>DataURL: Return Base64
 *      TriggerExport->>DownloadJS: Trigger Browser Download
 * ```
 */

import { useState } from "react";
import { toPng } from "html-to-image";
import download from "downloadjs";
import toast from "react-hot-toast";

export const useTeamExport = (exportRef) => {
    const [isExporting, setIsExporting] = useState(false);

    
    const triggerExport = async (fileName = `OPTC-Teams-Export-${Date.now()}.png`) => {
        if(isExporting || !exportRef.current) return;

        setIsExporting(true);
        const toastId = toast.loading('Generating Image...');

        try{
            //Wait a bit for React to render any final updates
            await new Promise(resolve => setTimeout(resolve, 300));
            const element = exportRef.current;
            if(!element) throw new Error('Export container not found');

            //1. Ensure all images are loaded (Critical for Safari/Firefox sometimes)
            const images = Array.from(element.querySelectorAll('img'));
            await Promise.all(images.map(img => {
                if(img.complete) return Promise.resolve();
                return new Promise((resolve)=> {
                    img.onload = resolve;
                    img.onerror = resolve; //Resolve anyway to not block
                });
            }));

            // 2. Decode images if possible 
            try{
                await Promise.all(images.map(img => img.decode().catch(()=> {})));
            } catch (e) { console.log('Image decode skipped');}

            // 3. Convert to PNG
            const dataUrl = await toPng(element, {
                    pixelRatio: 2,
                    backgroundColor: 'var(--bg-surface)',
                    style: {
                        opacity: '1',
                        transform: 'none',
                        zIndex: 'auto',
                        visibility: 'visible'
                    },
                    width: element.scrollWidth,
                    height: element.scrollHeight,
                    useCORS: true,
                    cacheBust: false
            });

            //4. Download
            download(dataUrl, fileName);
            toast.success('Image Saved!', {id: toastId});
            return true;

        } catch(error){
            console.error('Export failed', error);
            toast.error('Failed to generate image', {id: toastId});
            return false;
        }finally{
            setIsExporting(false);
        }
    };
    return {
        isExporting,
        triggerExport
    };
};