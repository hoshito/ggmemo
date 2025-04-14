export const getAuth = jest.fn().mockReturnValue({
  currentUser: null,
  signInWithPopup: jest.fn(),
  signOut: jest.fn(),
});

export class GoogleAuthProvider {
  static PROVIDER_ID = "google.com";
  static credential = jest.fn();
}
