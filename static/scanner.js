document.addEventListener("DOMContentLoaded", function () {
    const codeReader = new ZXing.BrowserQRCodeReader();
    const videoElement = document.getElementById("qr-video");
    const inputField = document.getElementById("kavach-main-unit");
    const scanButton = document.getElementById("start-scan");

    scanButton.addEventListener("click", async () => {
        try {
            videoElement.style.display = "block"; // Show video for scanning
            const devices = await codeReader.listVideoInputDevices();

            if (devices.length === 0) {
                alert("No camera found. Please connect a camera.");
                return;
            }

            await codeReader.decodeFromVideoDevice(undefined, "qr-video", (result, err) => {
                if (result) {
                    inputField.value = result.text.split("_")[0]; // Extract first part
                    videoElement.style.display = "none"; // Hide video after scanning
                    codeReader.reset(); // Stop scanning
                }
            });
        } catch (error) {
            console.error("Error starting scanner:", error);
            alert("QR scanner could not be started.");
        }
    });
});
