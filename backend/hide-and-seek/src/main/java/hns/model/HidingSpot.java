package hns.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HidingSpot {
    private int index;
    private String name;
    private Difficulty difficulty;
    private String spotImageUrl;
    private String hidingImageUrl;
    private String description;
    private int payoffIfFound;
    private int payoffIfHidden;
}
