//  Created by Jesse MacFadyen on 10-05-29.
//  Copyright 2010 Nitobi. All rights reserved.
//  Copyright 2012, Randy McMillan

#import "ChildBrowserCommand.h"
#import <Cordova/CDVViewController.h>
#import <AVFoundation/AVFoundation.h>

@implementation ChildBrowserCommand

@synthesize ChildBrowser;

//TODO
//- (void)showWebPage:(NSMutableArray*)arguments withDict:(BOOL*)options  // args: url
- (void) showWebPage:(CDVInvokedUrlCommand*)command
{
    /* setting audio session category to "Playback" (since iOS 6) */
    AVAudioSession *audioSession = [AVAudioSession sharedInstance];
    NSError *setCategoryError = nil;
    BOOL ok = [audioSession setCategory:AVAudioSessionCategoryPlayback error:&setCategoryError];
    if (!ok) {
        NSLog(@"Error setting AVAudioSessionCategoryPlayback: %@", setCategoryError);
    };

    if (self.ChildBrowser == nil) {
#if __has_feature(objc_arc)
        self.ChildBrowser = [[ChildBrowserViewController alloc] initWithScale:NO];
#else
        self.ChildBrowser = [[[ChildBrowserViewController alloc] initWithScale:NO] autorelease];
#endif
        self.ChildBrowser.delegate = self;
        self.ChildBrowser.orientationDelegate = self.viewController;
    }

    //TODO
    //self.hideNavBar = [(NSString*)[command.arguments objectAtIndex:1] isEqual: @"1"];

    /* // TODO: Work in progress
     NSString* strOrientations = [ options objectForKey:@"supportedOrientations"];
     NSArray* supportedOrientations = [strOrientations componentsSeparatedByString:@","];
     */

    [self.viewController presentModalViewController:ChildBrowser animated:YES];

    NSString * url = [command.arguments objectAtIndex:0];

    [self.ChildBrowser loadURL:url];
}

- (void)getPage:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options
{
    NSString* url = (NSString*)[arguments objectAtIndex:0];

    [self.ChildBrowser loadURL:url];
}

- (void)close:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options // args: url
{
    [self.ChildBrowser closeBrowser];
}

- (void)onClose
{
    [self.webView stringByEvaluatingJavaScriptFromString:@"window.plugins.childBrowser.onClose();"];
}

- (void)onOpenInSafari
{
    [self.webView stringByEvaluatingJavaScriptFromString:@"window.plugins.childBrowser.onOpenExternal();"];
}

- (void)onChildLocationChange:(NSString*)newLoc
{
    NSString* tempLoc = [NSString stringWithFormat:@"%@", newLoc];
    NSString* encUrl = [tempLoc stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding];

    NSString* jsCallback = [NSString stringWithFormat:@"window.plugins.childBrowser.onLocationChange('%@');", encUrl];

    [self.webView stringByEvaluatingJavaScriptFromString:jsCallback];
}


#if !__has_feature(objc_arc)
- (void)dealloc
{
    self.childBrowser = nil;

    [super dealloc];
}
#endif

@end