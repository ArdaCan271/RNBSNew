package com.visioncameracropper;
import android.graphics.Bitmap;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.google.mlkit.vision.barcode.common.Barcode;
import com.google.mlkit.vision.barcode.BarcodeScanner;
import com.google.mlkit.vision.barcode.BarcodeScannerOptions;
import com.google.mlkit.vision.barcode.BarcodeScanning;
import com.google.mlkit.vision.common.InputImage;
import com.google.android.gms.tasks.Task;
import com.google.android.gms.tasks.Tasks;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import android.graphics.Rect;

import com.mrousavy.camera.core.FrameInvalidError;
import com.mrousavy.camera.frameprocessors.Frame;
import com.mrousavy.camera.frameprocessors.FrameProcessorPlugin;
import com.mrousavy.camera.frameprocessors.VisionCameraProxy;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

public class CropperFrameProcessorPlugin extends FrameProcessorPlugin {
  static public Bitmap frameTaken;
  CropperFrameProcessorPlugin(@NonNull VisionCameraProxy proxy, @Nullable Map<String, Object> options) {super();}

  @Nullable
  @Override
  public Object callback(@NonNull Frame frame, @Nullable Map<String, Object> arguments){
    Map<String, Object> result = new HashMap<String, Object>();
    try {
      //Log.d("DYM",frame.getWidth()+"x"+frame.getHeight());
      Bitmap bm = BitmapUtils.getBitmap(frame);
      if (arguments != null && arguments.containsKey("cropRegion")) {
        Map<String,Object> cropRegion = (Map<String, Object>) arguments.get("cropRegion");
        double left = ((double) cropRegion.get("left")) / 100.0 * bm.getWidth();
        double top = ((double) cropRegion.get("top")) / 100.0 * bm.getHeight();
        double width = ((double) cropRegion.get("width")) / 100.0 * bm.getWidth();
        double height = ((double) cropRegion.get("height")) / 100.0 * bm.getHeight();
        bm = Bitmap.createBitmap(bm, (int) left, (int) top, (int) width, (int) height, null, false);
      }

        BarcodeScanner scanner = BarcodeScanning.getClient(
          new BarcodeScannerOptions.Builder()
            .setBarcodeFormats(Barcode.FORMAT_QR_CODE)
            .build()
        );
        InputImage image = InputImage.fromBitmap(bm, frame.getImageProxy().getImageInfo().getRotationDegrees());
        Task<List<Barcode>> task = scanner.process(image);
        List<Barcode> barcodes = Tasks.await(task);
        WritableNativeArray array = new WritableNativeArray();
        for (Barcode barcode : barcodes) {
          WritableNativeMap map = new WritableNativeMap();
          Rect bounds = barcode.getBoundingBox();
          if (bounds != null) {
            map.putInt("width", bounds.width());
            map.putInt("height", bounds.height());
            map.putInt("top", bounds.top);
            map.putInt("bottom", bounds.bottom);
            map.putInt("left", bounds.left);
            map.putInt("right", bounds.right);
          }
          String rawValue = barcode.getRawValue();
          map.putString("rawValue", rawValue);
          int valueType = barcode.getValueType();
          switch (valueType) {
            case Barcode.TYPE_WIFI:
              String ssid = barcode.getWifi().getSsid();
              map.putString("ssid", ssid);
              String password = barcode.getWifi().getPassword();
              map.putString("password", password);
              int encryptionType = barcode.getWifi().getEncryptionType();
              map.putInt("encryptionType", encryptionType);
              break;
            case Barcode.TYPE_URL:
              String title = barcode.getUrl().getTitle();
              map.putString("title", title);
              String url = barcode.getUrl().getUrl();
              map.putString("url", url);
              break;
          }
          array.pushMap(map);
        }
        return array.toArrayList();

      // if (arguments != null && arguments.containsKey("includeImageBase64")) {
      //   boolean includeImageBase64 = (boolean) arguments.get("includeImageBase64");
      //   if (includeImageBase64 == true) {
      //     result.put("base64",BitmapUtils.bitmap2Base64(bm));
      //   }
      // }

      // if (arguments != null && arguments.containsKey("saveBitmap")) {
      //   boolean saveBitmap = (boolean) arguments.get("saveBitmap");
      //   if (saveBitmap == true) {
      //     frameTaken = bm;
      //   }
      // }

      // if (arguments != null && arguments.containsKey("saveAsFile")) {
      //   boolean saveAsFile = (boolean) arguments.get("saveAsFile");
      //   if (saveAsFile == true) {
      //     File cacheDir = VisionCameraCropperModule.getContext().getCacheDir();
      //     String fileName = System.currentTimeMillis() + ".jpg";
      //     String path = BitmapUtils.saveImage(bm,cacheDir,fileName);
      //     result.put("path",path);
      //   }
      // }
    } catch (FrameInvalidError e) {
      throw new RuntimeException(e);
    } catch (ExecutionException e) {
      throw new RuntimeException(e);
    } catch (InterruptedException e) {
      throw new RuntimeException(e);
    }
    // return result;
  }

  static public Bitmap getBitmap() {
    try {
      return frameTaken;
    } catch (Exception e) {
      return null;
    }
  }
}
