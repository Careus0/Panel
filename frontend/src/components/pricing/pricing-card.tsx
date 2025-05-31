
import type { PricingPlan } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface PricingCardProps {
  plan: PricingPlan;
  onSubscribe: (planId: string) => void;
  currentPlan?: boolean;
}

export function PricingCard({ plan, onSubscribe, currentPlan = false }: PricingCardProps) {
  const isContactSalesPlan = plan.cta === "Hubungi Penjualan";

  return (
    <Card className={cn(
      "flex flex-col shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105",
      plan.highlight ? "border-primary border-2 ring-4 ring-primary/20" : "border"
    )}>
      <CardHeader className="pb-4">
        {plan.highlight ? (
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
            Paling Populer
          </div>
        ) : (
          // Placeholder to maintain height consistency with highlighted card
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide invisible" aria-hidden="true">
            &nbsp; {/* Non-breaking space to ensure height */}
          </div>
        )}
        <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
        <CardDescription className="text-4xl font-extrabold text-foreground mt-2">
          {plan.price.split('/')[0].split('(')[0].trim()} 
          {plan.price.includes('(') && !plan.price.includes('/') && (
             <span className="text-sm font-normal text-muted-foreground"> ({plan.price.split('(')[1]}</span>
          )}
          {plan.price.includes('/') && (
            <span className="text-sm font-normal text-muted-foreground">/{plan.price.split('/')[1].split('(')[0].trim()}</span>
          )}
           {plan.price.includes('/') && plan.price.includes('(') && (
             <span className="text-sm font-normal text-muted-foreground"> ({plan.price.split('(')[1]}</span>
          )}
        </CardDescription>
        <p className="text-sm text-muted-foreground mt-1">{plan.userbotSlotsDescription}</p>
      </CardHeader>
      <CardContent className="flex-grow space-y-3 pt-0">
        <ul className="space-y-2">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle2 className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
              <span className="text-sm text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="pt-4 border-t">
        {isContactSalesPlan ? (
          <Button 
            asChild
            className={cn(
              "w-full",
              "bg-accent hover:bg-accent/90 text-accent-foreground" // Custom and Bespoke plan button style
            )}
          >
            <Link href="/help"> 
              <MessageSquare className="mr-2 h-4 w-4" />
              {plan.cta}
            </Link>
          </Button>
        ) : (
          <Button 
            className={cn(
              "w-full", 
              plan.highlight ? "bg-primary hover:bg-primary/90 text-primary-foreground" : "bg-accent hover:bg-accent/90 text-accent-foreground",
              currentPlan && "bg-green-600 hover:bg-green-700 text-white" // Example for current plan
              )}
            onClick={() => !currentPlan && onSubscribe(plan.id)}
            disabled={currentPlan}
          >
            {currentPlan ? "Paket Saat Ini" : plan.cta} 
            {!currentPlan && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
