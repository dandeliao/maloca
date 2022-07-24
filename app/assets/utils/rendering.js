export function togglePressed (imgButton) {
	if (imgButton.pressed) {
		imgButton.pressed = false;
	} else {
		imgButton.pressed = true;
	}
}