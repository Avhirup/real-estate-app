import { Button } from '@material-tailwind/react';

export function ButtonLoading() {
  return (
    <Button
      className="mt-6  flex justify-center items-center"
      fullWidth
      loading={true}
    >
      Loading
    </Button>
  );
}
