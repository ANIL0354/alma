/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTI18nUtil.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

#import <Firebase.h>
#import "RNFirebaseNotifications.h"
#import "RNFirebaseMessaging.h"

@implementation AppDelegate
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [FIRApp configure];
  [RNFirebaseNotifications configure];
  
  [[FIRInstanceID instanceID] instanceIDWithHandler:^(FIRInstanceIDResult * _Nullable result,
                                                      NSError * _Nullable error) {
    if (error != nil) {
      NSLog(@"Error fetching remote instance ID: %@", error);
    } else {
      NSLog(@"Remote instance ID token: %@", result.token);
    }
  }];
  
  [FIRMessaging messaging].autoInitEnabled = YES;
  
  [[RCTI18nUtil sharedInstance] allowRTL:YES];
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"NonyChat"
                                            initialProperties:nil];
  
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
//  NSString *userAgent = @"Mozilla/5.0 (compatible; MSIE 10.0; Iphone Phone 8.0; Nony/6.0; IEMobile/10.0; ARM; Touch; IPhone; Apple 920)";
//    NSString *userAgent = @"Mozilla/5.0 (compatible; MSIE 10.0; Iphone Phone 8.0; Nony/7.0; IEMobile/10.0; ARM; Touch; Nokia; Lumia 920; DeviceId 86744a5ac54931c9)";
    UIDevice *currentDevice = [UIDevice currentDevice];
    NSString *deviceId = [[currentDevice identifierForVendor] UUIDString];
  //  NSLog(@"%0.4f hello swift",*deviceId);
   
 
//  NSString *newString = [NSString stringWithFormat:@"Mozilla/5.0 (compatible; MSIE 10.0; Iphone Phone 8.0; Nony/7.0; IEMobile/10.0; ARM; Touch; Nokia; Lumia 920; DeviceId " deviceId: @")"];


  NSMutableString *final = [NSMutableString stringWithString:@"Mozilla/5.0 (compatible; MSIE 10.0; Iphone Phone 8.0; Nony/9.0; IEMobile/10.0; ARM; Touch; Nokia; Lumia 920; DeviceId "];
  [final appendString:deviceId];
  [final appendString:@")"];
  
//   NSString *final = @"Mozilla/5.0 (compatible; MSIE 10.0; Iphone Phone 8.0; Nony/6.0; IEMobile/10.0; ARM; Touch; IPhone; Apple 920";

 NSLog(@"Value of hello = %@", final);

  
//  Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36
//  Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 920)
  NSDictionary *dictionary = [[NSDictionary alloc] initWithObjectsAndKeys:final, @"UserAgent", nil];
  [[NSUserDefaults standardUserDefaults] registerDefaults:dictionary];
  
  [[UNUserNotificationCenter currentNotificationCenter] setDelegate:self];
  [application registerForRemoteNotifications];
  
  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  #if DEBUG
    return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
  #else
    return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
  #endif
}

- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification {
  [[RNFirebaseNotifications instance] didReceiveLocalNotification:notification];
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(nonnull NSDictionary *)userInfo
fetchCompletionHandler:(nonnull void (^)(UIBackgroundFetchResult))completionHandler{
  [[RNFirebaseNotifications instance] didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}

- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings {
  [[RNFirebaseMessaging instance] didRegisterUserNotificationSettings:notificationSettings];
}
  
@end
