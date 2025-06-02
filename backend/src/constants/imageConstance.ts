export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const MESSAGES = {
  IMAGE_DELETED: 'Image deleted',
  IMAGES_REORDERED: 'Images reordered successfully',
} as const;

export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized',
  UNAUTHORIZED_NO_USER: 'Unauthorized: No user found',
  IMAGE_NOT_FOUND: 'Image not found or not authorized',
  FAILED_TO_UPLOAD: 'Failed to upload images',
  FAILED_TO_FETCH: 'Failed to fetch images',
  FAILED_TO_UPDATE: 'Failed to update image',
  FAILED_TO_DELETE: 'Failed to delete image',
  INVALID_IMAGE_IDS: 'One or more image IDs are invalid',
  IMAGES_NOT_USER_OWNED: 'Some images do not belong to the user',
  INVALID_IMAGES_ARRAY: 'Images must be a non-empty array',
} as const;