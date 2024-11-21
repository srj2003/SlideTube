"use client"
import { useState } from "react";
import { VideoIcon } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import MaxWidthWrapper from "./common/MaxWidthWrapper";
import { Card } from "./ui/card";
import { CreatePowerpoint } from "@/app/generate/actions";


export default function GenerateForm(){
    const[url, setUrl]=useState<string | null>("");
    const[isValid, setIsValid]=useState<boolean>(false);
    const[error, setError]=useState<string | null>(null);
    const[isLoading, setIsLoading]=useState<boolean>(false);

    const handleGenerate = async () => {
        if (!url) {
          setError("Please enter a valid YouTube URL");
          return;
        }
    
        if (!isValid) {
          setError("Invalid YouTube URL");
          return;
        }
    
        setError(null);
    
        const videoId = getVideoId(url || "");
        if (!videoId) {
          setError("Invalid YouTube URL");
          return;
        }
    
        setIsLoading(true);
        try{
            await CreatePowerpoint(videoId);
        }catch(error){
            console.error("Failed to create presentation");
        }
    }

    const getVideoId = (url: string) => {
        const match = url.match(
          /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
        );
        return match ? match[1] : null;
      };

    const validateYouTubeUrl = (url: string) => {
        const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|embed\/)?[a-zA-Z0-9_-]{11}/;
        return pattern.test(url);
      };

    const handleUrlChange=(e: React.ChangeEvent<HTMLInputElement>)=>{
        const newUrl = e.target.value.trim();

    if (!newUrl) {
      setError(null);
      setIsValid(false);
      return;
    }

    setUrl(newUrl);

    const videoId = getVideoId(newUrl);
    if (validateYouTubeUrl(newUrl) && videoId) {
      setError(null);
      setIsValid(true);
    } else {
      setError("Invalid YouTube URL");
      setIsValid(false);
    }
    }

    return(
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-100 py-12">
        <MaxWidthWrapper>
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 hover:text-blue-900">
                    Create Beautiful Presentations {""}
                    <span className="block text-lg font-normal text-gray-800 mt-3 hover:underline">
                        Transform any Youtube Video into professional Powerpoint to Presentations
                    </span>
                </h1>
                <Card className="p-8 shadow-xl bg-white/80 backdrop-blur-sm border-0">
                {isValid ? (
                        <div className="mb-8 aspect-video rounded-xl overflow-hidden shadow-lg">
                            <iframe 
                            src={`https://www.youtube.com/embed/${getVideoId(url || "")}`}
                            className="w-full h-full"
                            allowFullScreen
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; 
                            gyroscope; picture-in-picture; web-share"
                            title="YouTube video player"
                            />
                        </div>)
                        :
                        (
                            <div className="mb-8 aspect-video bg-gradient-to-br from-slate-100 to-slate-50 rounded-xl flex flex-col items-center justify-center text-slate-500 shadow-inner">
                                <VideoIcon className="w-12 h-12 text-slate-500" />
                                <p className="mt-2 text-lg font-medium">
                                    Paste Youtube URL to get started
                                </p>
                            </div>
                        )}
                        <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="url"
                placeholder="paste YouTube URL here"
                value={url || ""}
                onChange={handleUrlChange}
                className="flex-2 px-4 
                rounded-xl border-slate-200 
                focus:border-violet-500 focus:ring-violet-500 mr-2 h-15 w-full"
                disabled={isLoading}
                aria-label="YouTube URL"
              />
              <Button
                disabled={!isValid || isLoading}
                className="h-12 px-6"
                onClick={handleGenerate}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating a presentation
                  </>
                ) : (
                  "Create presentation"
                )}
              </Button>

            </div>
            <p className="text-center text-sm text-slate-500 mt-4">
              Supported formats: YouTube video URLs (e.g,
              https://youtube.com/watch?v=...)
            </p>
            </Card>
            </div>
            </MaxWidthWrapper>
        </div>
    );
}