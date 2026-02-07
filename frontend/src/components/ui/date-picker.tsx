"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { OrangeCalendar } from "@/components/ui/calendar-orange"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Card, CardContent } from "@/components/ui/card"

interface DatePickerProps extends React.HTMLAttributes<HTMLDivElement> {
    date: Date | undefined
    setDate: (date: Date | undefined) => void
}

export function DatePicker({
    className,
    date,
    setDate,
}: DatePickerProps) {
    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                            "w-full md:w-[240px] justify-start text-left font-normal rounded-full bg-white dark:bg-neutral-950",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Card className="mx-auto w-fit p-0 border-0 shadow-none">
                        <CardContent className="p-0">
                            <OrangeCalendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                            />
                        </CardContent>
                    </Card>
                </PopoverContent>
            </Popover>
        </div>
    )
}
