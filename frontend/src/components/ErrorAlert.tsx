import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";

export interface ErrorAlertProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  extra?: React.ReactNode;
}

export default function ErrorAlert(props: ErrorAlertProps) {
  const {
    title = "Error",
    description = "Oops, something went wrong",
    extra,
  } = props;
  return (
    <Alert variant="destructive">
      <ExclamationTriangleIcon className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
      {extra ? <div className="mt-2">{extra}</div> : null}
    </Alert>
  );
}
