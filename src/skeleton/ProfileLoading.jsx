import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

export default function ProfileLoading() {
  return (
    <Stack spacing={1}>
      {/* For variant="text", adjust the height via font-size */}
      <Skeleton variant="text" sx={{ fontSize: '2rem' }} />
      {/* For other variants, adjust the size with `width` and `height` */}
      <div
        className="load"
        style={{
          // border: '1px solid green',
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '2rem',
          margin: '1rem 0',
        }}
      >
        <Skeleton variant="circular" width={60} height={60} />
        <Skeleton variant="rounded" width={210} height={80} />
      </div>
      <div
        style={{
          // border: '1px solid red',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '2rem',
          margin: '1rem 0',
        }}
      >
        <Skeleton variant="rounded" height={80} />
        <Skeleton variant="rounded" height={80} />
      </div>
    </Stack>
  );
}
