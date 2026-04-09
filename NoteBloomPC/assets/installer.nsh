; NoteBloom NSIS installer customization
; This file is included by electron-builder automatically

!macro customHeader
  !system "echo Building NoteBloom installer..."
!macroend

!macro customInstall
  ; Create AppData directory for user data
  CreateDirectory "$APPDATA\NoteBloom"
!macroend

!macro customUnInstall
  ; Optional: ask user if they want to delete their notes
  MessageBox MB_YESNO "Voulez-vous supprimer vos notes sauvegardées ?" IDNO skip_delete
    RMDir /r "$APPDATA\NoteBloom"
  skip_delete:
!macroend
