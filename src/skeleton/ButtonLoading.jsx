import { Button } from '@material-tailwind/react';

export function ButtonLoading({ text }) {
  return (
    <Button
      className="mt-6  flex justify-center items-center"
      fullWidth
      loading={true}
    >
      {text}
    </Button>
  );
}

ButtonLoading.defaultProps = {
  text: 'Loading',
};
