/* Copyright 2013 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.google.devrel.samples.ttt.spi;

import java.util.Random;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.devrel.samples.ttt.Board;

/**
 * Defines v1 of a Board resource as part of the tictactoe API, which provides
 * clients the ability to query for a computer's next move given an input
 * board.
 */
@Api(
    name = "tictactoe",
    version = "v1"
)
public class BoardV1 {
  public static final char X = 'X';
  public static final char O = 'O';
  public static final char DASH = '-';
  
  /**
   * Provides the ability to insert a new Score entity.
   * 
   * @param board object representing the state of the board
   * @return the board including the computer's move
   */
  @ApiMethod(name = "board.getmove", httpMethod = "POST")
  public Board getmove(Board board) {
    char[][] parsed = parseBoard(board.getState());
    int free = countFree(parsed);
    parsed = addMove(parsed, free);
    
    StringBuilder builder = new StringBuilder();
    for (int i = 0; i < parsed.length; i++) {
      builder.append(String.valueOf(parsed[i]));
    }
    Board updated = new Board();
    updated.setState(builder.toString());
    return updated;
  }
  
  private char[][] parseBoard(String boardString) {
    char[][] board = new char[3][3];
    char[] chars = boardString.toCharArray();
    if (chars.length == 9) {
      for (int i = 0; i < chars.length; i++) {
        board[i/3][i%3] = chars[i];
      }
    }
    
    return board;
  }
  
  private int countFree(char[][] board) {
    int count = 0;
    for (int i = 0; i < board.length; i++) {
      for (int j = 0; j < board[i].length; j++) {
        if (board[i][j] != X && board[i][j] != O) {
          count++;
        }
      }
    }
    return count;
  }
  
  private char[][] addMove(char[][] board, int free) {
    int index = new Random().nextInt(free) + 1;
    for (int i = 0; i < board.length; i++) {
      for (int j = 0; j < board.length; j++) {
        if (board[i][j] == DASH) {
          if (free == index) {
            board[i][j] = O;
            return board;
          } else {
            free--;
          }
        }
      }
    }
    // Only occurs when empty > the number of actual empty squares.
    return board;
  }
}
