import { Card, Divider } from "@nextui-org/react";
import { GenericInput } from "components/inputs/GenericInput";
import { useSupabase } from "components/providers/supabase-provider";
import React, { useEffect, useState } from "react";
import { ProfileRow } from "types";
import { getProfileByUserId } from "utils/supabase/profiles";

type FieldName = keyof ProfileRow;

export default function Profile() {
  const { supabase, session } = useSupabase();

  const [profile, setProfile] = useState<ProfileRow | null>(null);

  useEffect(() => {
    if (!session?.user.id) return;
    getProfileByUserId(supabase, session?.user.id).then((profile) => {
      setProfile(profile);
    });
  }, [profile]);

  const onInputFieldBlur = async (fieldName: FieldName, fieldValue: string) => {
    await supabase
      .from("profiles")
      .update({ ...profile, [fieldName]: fieldValue })
      .eq("user_id", session?.user.id);
  };

  return (
    <div>
      <div>
        <div>
          <Card>
            {profile ? (
              <div className="flex flex-column gap-8">
                <h2>Settings</h2>
                <h4>Profile</h4>
                <GenericInput
                  label="Name"
                  initialValue={profile.name}
                  onInputFieldBlur={(value) => onInputFieldBlur("name", value)}
                />

                <Divider />
                <h4>Flashcards</h4>
                <GenericInput
                  label="First learning phase interval"
                  initialValue={
                    profile.first_learning_phase_interval?.toString() || ""
                  }
                  onInputFieldBlur={(value) =>
                    onInputFieldBlur("first_learning_phase_interval", value)
                  }
                />
                <GenericInput
                  label="Second learning phase interval"
                  initialValue={
                    profile.second_learning_phase_interval?.toString() || ""
                  }
                  onInputFieldBlur={(value) =>
                    onInputFieldBlur("second_learning_phase_interval", value)
                  }
                />
              </div>
            ) : (
              <h2>Loading...</h2>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

// const BackgroundDiv = styled.div`
//   background-color: ${theme.colors.white.value};
//   height: 100%;
//   width: 100%;
//   margin-top: ${theme.space[12].value};
// `;

// const HeadingContainer = styled.div`
//   display: flex;
//   justify-content: center;
//   flex-direction: column;
// `;

// const PaddedCard = NextUIStyled(Card, {
//   padding: theme.space[12].value,
// });
