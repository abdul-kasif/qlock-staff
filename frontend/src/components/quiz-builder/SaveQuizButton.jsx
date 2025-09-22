import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

export default function SaveQuizButton({ onClick, isLoading }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 shadow-lg">
      <div className="max-w-4xl mx-auto">
        <Button
          onClick={onClick}
          disabled={isLoading}
          className="w-full py-6 text-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving Quiz...
            </span>
          ) : (
            <>
              <Save className="mr-2 h-5 w-5" />
              Save Quiz & Generate Access Code
            </>
          )}
        </Button>
      </div>
    </div>
  );
}