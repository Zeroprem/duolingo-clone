"use client"
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect,useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import { useExitModal } from "@/store/use-exit-modal";
export const ExitModal = () => {
  const router=useRouter();
  const [isClient,setisClient]=useState(false);
  const {isOpen,close}=useExitModal();

  useEffect(()=>setisClient(true),[]);

  if(!isClient){
    return null;
  }

  return(
    <Dialog open={isOpen} onOpenChange={close}>
        <DialogContent className="max-w-md">
           <DialogHeader>
            <div className="flex items-center w-full justify-center mb-5">
            <Image
            src="/mascot_sad.svg"
            alt="mascot Sad"
            height={80}
            width={80}
            />
            </div>
            <DialogTitle className="text-center font-bold text-2xl">
                Wait, don&apos;t go!
            </DialogTitle>
            <DialogDescription className="text-center font-base ">
                You&apos;re about to leave lesson. Are you sure?
            </DialogDescription>
           </DialogHeader>
           <DialogFooter className="mb-4">
            <div className="flex flex-col w-full gap-y-4">
                <Button variant="primary" 
                className="w-full"
                size="lg" 
                onClick={close}>
                    Keep learning
                </Button>
                <Button variant="dangerOutline" 
                className="w-full"
                size="lg" 
                onClick={()=>{
                    close();
                    router.push("/learn");
                }}>
                    End Session
                </Button>
            </div>
           </DialogFooter>
        </DialogContent>
    </Dialog>
  );
};
