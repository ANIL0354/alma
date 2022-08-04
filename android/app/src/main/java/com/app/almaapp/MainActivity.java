package com.app.almaapp;

import android.app.NotificationManager;
import android.content.Context;
import android.content.res.Configuration;
import android.os.Build;

import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

  @Override
  public void onResume() {
    super.onResume();
    NotificationManager notificationManager = (NotificationManager)getSystemService(Context.NOTIFICATION_SERVICE);
    notificationManager.cancelAll();
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "Alma";
  }

}
