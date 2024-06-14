import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Tooltip,
  IconButton,
} from '@material-tailwind/react';

export function CategoryCard({ heading, imgLink }) {
  return (
    // <Card className="w-full max-w-[24rem] shadow-lg border-2 border-gray-200 h-[360px] transition-all hover:border-gray-400">
    <Card className="w-full max-w-[24rem] shadow-lg border-2 border-gray-200 transition-all hover:border-gray-400">
      <CardHeader floated={false} color="blue-gray">
        <div className="w-[350px] h-[200px]">
          {/* <img src={imgLink} alt="image" className="h-[360px] object-cover" /> */}
          <img
            src={imgLink}
            alt="image"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </CardHeader>
      <CardBody>
        <div className="mb-1 flex items-center justify-between">
          <Typography
            variant="paragraph"
            color="blue-gray"
            className="font-medium"
          >
            {heading}
          </Typography>
        </div>
      </CardBody>
    </Card>
  );
}
