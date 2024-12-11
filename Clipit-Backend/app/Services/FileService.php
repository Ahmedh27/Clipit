<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Image;

class FileService
{
    /**
     * Update the image and upload it to S3.
     *
     * @param mixed $model
     * @param \Illuminate\Http\Request $request
     * @return mixed
     * @throws \Exception
     */
    public function updateImage($model, $request)
    {
        try {
            Log::info('Starting image upload to S3', ['user_id' => $model->id]);

            // Initialize Intervention Image
            $image = Image::make($request->file('image'));

            // Validate and crop the image based on the request parameters
            $width = $request->input('width');
            $height = $request->input('height');
            $left = $request->input('left');
            $top = $request->input('top');

            $imageWidth = $image->width();
            $imageHeight = $image->height();

            if ($width > $imageWidth || $height > $imageHeight || $left < 0 || $top < 0) {
                throw new \Exception('Invalid cropping dimensions');
            }

            $image->crop($width, $height, $left, $top);

            // Generate a unique file name
            $fileName = time() . '.jpg';
            $filePath = "images/{$fileName}";

            Log::info('Uploading image to S3', ['file_name' => $fileName, 'file_path' => $filePath]);

            // Upload the image stream directly to S3
            $s3 = Storage::disk('s3');
            $result = $s3->put($filePath, $image->stream('jpg', 90), 'public');

            if (!$result) {
                Log::error('S3 upload failed', ['file_path' => $filePath]);
                throw new \Exception('Failed to upload image to S3.');
            }

            // Get the public URL of the uploaded file
            $imageUrl = $s3->url($filePath);

            // Log and save the URL to the model
            Log::info('Image successfully uploaded to S3', ['url' => $imageUrl]);
            $model->image = $imageUrl;
            $model->save();

            return $model;

        } catch (\Throwable $e) {
            Log::error('FileService Error (Image)', [
                'exception' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            throw $e;
        }
    }

    /**
     * Add a video and upload it to S3.
     *
     * @param mixed $model
     * @param \Illuminate\Http\Request $request
     * @return mixed
     * @throws \Exception
     */
    public function addVideo($model, $request)
    {
        try {
            Log::info('Starting video upload to S3', ['user_id' => $model->id]);

            $video = $request->file('video');
            $fileName = time() . '.' . $video->getClientOriginalExtension();
            $filePath = "videos/{$fileName}";

            Log::info('Uploading video to S3', ['file_name' => $fileName, 'file_path' => $filePath]);

            // Upload the video file to S3
            $s3 = Storage::disk('s3');
            $result = $s3->put($filePath, file_get_contents($video->getRealPath()), 'public');

            if (!$result) {
                Log::error('S3 upload failed', ['file_path' => $filePath]);
                throw new \Exception('Failed to upload video to S3.');
            }

            // Get the public URL of the uploaded file
            $videoUrl = $s3->url($filePath);

            // Log and save the URL to the model
            Log::info('Video successfully uploaded to S3', ['url' => $videoUrl]);
            $model->video = $videoUrl;
            $model->save();

            return $model;

        } catch (\Throwable $e) {
            Log::error('FileService Error (Video)', [
                'exception' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            throw $e;
        }
    }
}
