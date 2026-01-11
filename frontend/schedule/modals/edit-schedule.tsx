"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";
import { DateTime } from "luxon";
import type { DateRange } from "react-day-picker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/frontend/core/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/frontend/core/components/ui/tabs";
import Form from "@/frontend/core/components/form/form";
import SubmitButton from "@/frontend/core/components/form/submit-button";
import CancelButton from "@/frontend/core/components/form/cancel-button";
import {
  createOrUpdateScheduleSchema,
  type CreateOrUpdateScheduleRequest,
} from "@/lib/api/schedule/create-or-update-schedule";
import { getSchedule } from "@/lib/api/schedule/get-schedule";
import { useCreateOrUpdateSchedule } from "@/frontend/schedule/hooks/useCreateOrUpdateSchedule";
import StudyDaysSelector from "@/frontend/schedule/components/study-days-selector";
import ReviewDaysSelector from "@/frontend/schedule/components/review-days-selector";

type EditScheduleModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function EditScheduleModal({
  isOpen,
  onClose,
}: EditScheduleModalProps) {
  const { data: currentSchedule, isLoading } = useQuery({
    queryKey: ["schedule"],
    queryFn: getSchedule,
    enabled: isOpen,
  });

  // 현재 스케줄을 날짜로 변환 (미래 날짜 기준)
  const initialStudyRange = useMemo<DateRange | undefined>(() => {
    if (!currentSchedule) return undefined;
    const today = DateTime.now().startOf("day");
    const studyEnd = today.plus({ days: currentSchedule.studyDays });
    return {
      from: today.toJSDate(),
      to: studyEnd.toJSDate(),
    };
  }, [currentSchedule]);

  const initialReviewDates = useMemo<Date[]>(() => {
    if (!currentSchedule) return [];
    const today = DateTime.now().startOf("day");
    return currentSchedule.reviewDays.map((days) =>
      today.plus({ days }).toJSDate()
    );
  }, [currentSchedule]);

  const [studyRange, setStudyRange] = useState<DateRange | undefined>(
    initialStudyRange
  );

  const handleStudyRangeChange = (range: DateRange | undefined) => {
    if (!range) {
      return;
    }

    const today = DateTime.now().startOf("day").toJSDate();
    const fixedRange: DateRange = {
      from: today,
      to: range.to || range.from,
    };
    setStudyRange(fixedRange);
  };

  const [reviewDates, setReviewDates] = useState<Date[]>(initialReviewDates);

  const handleReviewDatesChange = (dates: Date[] | undefined) => {
    if (!dates) {
      setReviewDates([]);
      return;
    }
    const today = DateTime.now().startOf("day").toJSDate();
    const filteredDates = dates.filter((date) => {
      const dateToCheck = new Date(date);
      dateToCheck.setHours(0, 0, 0, 0);
      return dateToCheck.getTime() !== today.getTime();
    });
    setReviewDates(filteredDates);
  };

  const [activeTab, setActiveTab] = useState<"study" | "review">("study");

  const {
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<CreateOrUpdateScheduleRequest>({
    resolver: zodResolver(createOrUpdateScheduleSchema),
  });

  const mutation = useCreateOrUpdateSchedule({
    onSuccess: () => {
      onClose();
      reset();
    },
  });

  // 모달이 열릴 때마다 초기값으로 리셋 및 form에 초기값 설정
  useEffect(() => {
    if (isOpen && currentSchedule) {
      setActiveTab("study");
      setStudyRange(initialStudyRange);
      setReviewDates(initialReviewDates);
      // form에 초기값 설정
      setValue("studyDays", currentSchedule.studyDays);
      setValue("reviewDays", currentSchedule.reviewDays);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, currentSchedule]);

  // studyRange가 변경될 때마다 form에 값 업데이트
  useEffect(() => {
    if (studyRange?.from && studyRange?.to) {
      const studyDays = calculateStudyDays(studyRange);
      setValue("studyDays", studyDays);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studyRange]);

  // reviewDates가 변경될 때마다 form에 값 업데이트
  useEffect(() => {
    if (reviewDates.length > 0) {
      const reviewDays = calculateReviewDays(reviewDates);
      setValue("reviewDays", reviewDays);
    } else {
      setValue("reviewDays", []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviewDates]);

  // 날짜 범위를 일수로 변환 (미래 날짜 기준)
  const calculateStudyDays = (range: DateRange | undefined): number => {
    if (!range?.from || !range?.to) return 2;
    const from = DateTime.fromJSDate(range.from).startOf("day");
    const to = DateTime.fromJSDate(range.to).startOf("day");
    const days = Math.floor(to.diff(from, "days").days);
    return Math.max(0, days);
  };

  // 선택된 날짜들을 일수 배열로 변환 (미래 날짜 기준)
  const calculateReviewDays = (dates: Date[]): number[] => {
    const today = DateTime.now().startOf("day");
    return dates
      .map((date) => {
        const dateTime = DateTime.fromJSDate(date).startOf("day");
        return Math.floor(dateTime.diff(today, "days").days);
      })
      .filter((days) => days > 0)
      .sort((a, b) => a - b);
  };

  const onSubmit = () => {
    const studyDays = calculateStudyDays(studyRange);
    const reviewDays = calculateReviewDays(reviewDates);

    // zod 스키마로 검증
    const validatedData = createOrUpdateScheduleSchema.parse({
      studyDays,
      reviewDays,
    });

    mutation.mutate(validatedData);
  };

  const handleClose = () => {
    onClose();
    if (currentSchedule) {
      const today = DateTime.now().startOf("day");
      const studyEnd = today.plus({ days: currentSchedule.studyDays });
      setStudyRange({
        from: today.toJSDate(),
        to: studyEnd.toJSDate(),
      });
      const dates = currentSchedule.reviewDays.map((days) =>
        today.plus({ days }).toJSDate()
      );
      setReviewDates(dates);
    }
    reset();
    mutation.reset();
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>스케줄 조정하기</DialogTitle>
          </DialogHeader>
          <div>로딩 중...</div>
        </DialogContent>
      </Dialog>
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const disabledDates = (date: Date) => {
    const dateToCheck = new Date(date);
    dateToCheck.setHours(0, 0, 0, 0);
    return dateToCheck < today;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>스케줄 조정하기</DialogTitle>
        </DialogHeader>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as "study" | "review")}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="study">학습 기간</TabsTrigger>
              <TabsTrigger value="review">복습 기간</TabsTrigger>
            </TabsList>

            <TabsContent value="study" className="space-y-4 mt-4">
              <StudyDaysSelector
                studyRange={studyRange}
                onSelect={handleStudyRangeChange}
                disabledDates={disabledDates}
              />
            </TabsContent>

            <TabsContent value="review" className="space-y-4 mt-4">
              <ReviewDaysSelector
                reviewDates={reviewDates}
                onSelect={handleReviewDatesChange}
                disabledDates={disabledDates}
              />
            </TabsContent>
          </Tabs>

          {errors.studyDays && (
            <div className="text-sm text-destructive mt-2">
              studyDays: {errors.studyDays.message}
            </div>
          )}
          {errors.reviewDays && (
            <div className="text-sm text-destructive mt-2">
              reviewDays: {errors.reviewDays.message}
            </div>
          )}

          {mutation.isError && (
            <div className="text-destructive mb-4">
              error: {(mutation.error as Error).message}
            </div>
          )}

          <div className="flex gap-2 justify-end mt-6">
            <CancelButton onClick={handleClose} />
            <SubmitButton
              isLoading={mutation.isPending}
              loadingText="저장 중..."
              disabled={!studyRange?.from || !studyRange?.to}
            >
              저장
            </SubmitButton>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
