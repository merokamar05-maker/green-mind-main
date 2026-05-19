import cv2

img = cv2.imread("fish1.jpg")
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

cv2.imshow("Image", img)
cv2.imshow("Gray", gray)

img = cv2.imread("fish1.jpg")
resized = cv2.resize(img, (300,300))
flipped = cv2.flip(img, 1)

M = cv2.getRotationMatrix2D((200,200), 45, 1)
rotated = cv2.warpAffine(img, M, (400,400))

cv2.imshow("Resized", resized)
cv2.imshow("Flipped", flipped)
cv2.imshow("Rotated", rotated)

cv2.waitKey(0)
cv2.destroyAllWindows()