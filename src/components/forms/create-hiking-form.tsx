import { useState } from "react";
import { FormProvider, useForm, type SubmitErrorHandler, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateHiking } from "@/hooks";
import { Button } from "@/components/ui/button";
import { createHikingSchema, type CreateHikingFormData } from "@/schemas/hiking";
import { RHFInput } from "../rhf";

const defaultFormValues: CreateHikingFormData = {
  name: "",
  daysTotal: 1,
  membersTotal: 1,
  vegetariansTotal: 0,
};

export const CreateHikingForm = () => {
  const [formKey, setFormKey] = useState(0);

  return <CreateHikingFormFields key={formKey} onCreated={() => setFormKey((k) => k + 1)} />;
};

const TEST_MODE = false;

const CreateHikingFormFields = ({ onCreated }: { onCreated: () => void }) => {
  const createHiking = useCreateHiking();

  const form = useForm<CreateHikingFormData>({
    resolver: zodResolver(createHikingSchema),
    defaultValues: defaultFormValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const { isSubmitting } = form.formState;
  const { handleSubmit } = form;

  const submitHandler: SubmitHandler<CreateHikingFormData> = (data) => {
    if (TEST_MODE) {
      console.log("submitHandler data", data);
    } else {
      createHiking.mutate(data, {
        onSuccess: () => {
          onCreated();
        },
      });
    }
  };

  const errorHandler: SubmitErrorHandler<CreateHikingFormData> = (errs) => {
    if (TEST_MODE) console.log("errorHandler errors", errs);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(submitHandler, errorHandler)} className="grid max-w-md gap-4">
        <RHFInput<CreateHikingFormData>
          name="name"
          label="Name"
          helpText="Trip or plan title"
          placeholder="e.g. Dolomites 2026"
        />
        <RHFInput<CreateHikingFormData>
          name="daysTotal"
          label="Days total"
          type="number"
          step={1}
          min={1}
          id="daysTotal"
          valueAsNumber
        />
        <RHFInput<CreateHikingFormData>
          name="membersTotal"
          label="Members total"
          type="number"
          step={1}
          min={1}
          id="membersTotal"
          valueAsNumber
        />
        <RHFInput<CreateHikingFormData>
          name="vegetariansTotal"
          label="Vegetarians total"
          type="number"
          step={1}
          min={0}
          id="vegetariansTotal"
          valueAsNumber
        />
        <Button type="submit" disabled={createHiking.isPending || isSubmitting}>
          {createHiking.isPending ? "Creating…" : "Create hiking"}
        </Button>
      </form>
    </FormProvider>
  );
};
