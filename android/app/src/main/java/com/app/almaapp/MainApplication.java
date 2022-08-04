package com.app.almaapp;

import android.app.Application;
import android.content.Context;

import androidx.multidex.MultiDexApplication;

import com.facebook.ads.AudienceNetworkAds;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import io.invertase.firebase.app.ReactNativeFirebaseAppPackage;
import io.invertase.firebase.messaging.ReactNativeFirebaseMessagingPackage;
import com.dooboolab.RNIap.RNIapPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;  // <--- Import Package

import java.lang.reflect.InvocationTargetException;
import java.util.List;
import com.facebook.react.modules.i18nmanager.I18nUtil;

public class MainApplication extends MultiDexApplication implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // packages.add(new FBAdsPackage());
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    AudienceNetworkAds.initialize(this);
    SoLoader.init(this, /* native exopackage */ false);

    I18nUtil sharedI18nUtilInstance = I18nUtil.getInstance();
    sharedI18nUtilInstance.allowRTL(getApplicationContext(), false);
  }

}
